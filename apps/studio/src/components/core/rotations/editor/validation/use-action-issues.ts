"use client";

import type { ValidationError } from "wowlab-engine";

import { useMemo } from "react";

import type { ActionEntry } from "../types";

import { type RotationValidationState } from "./types";

export type ActionIssue = {
  kind: ActionIssueKind;
  errorType: ValidationError["type"];
  slug?: string;
  listName?: string;
};

export type ActionIssueKind =
  | "duplicate_list"
  | "empty_list"
  | "invalid_expression"
  | "type_mismatch"
  | "undefined_list"
  | "undefined_variable"
  | "unknown_aura"
  | "unknown_spell"
  | "unknown_talent";

export type ActionIssuesIndex = {
  byAction: Map<string, ActionIssue[]>;
};

type ValidationErrorWithLocation = {
  action_index?: number;
  list_name?: string;
  slug?: string;
} & ValidationError;

export function useActionIssues(
  state: RotationValidationState,
  lists: Record<string, ActionEntry[]>,
): ActionIssuesIndex {
  return useMemo(() => {
    const byAction = new Map<string, ActionIssue[]>();

    if (state.status !== "errors") {
      return { byAction };
    }

    for (const raw of state.errors) {
      collectActionIssue(byAction, raw as ValidationErrorWithLocation, lists);
    }

    return { byAction };
  }, [state, lists]);
}

function actionReferencesSlug(entry: ActionEntry, slug: string): boolean {
  if (entry.type === "cast" && entry.spell === slug) {
    return true;
  }

  if (entry.type === "use_item" && entry.name === slug) {
    return true;
  }

  return false;
}

function addIssue(
  store: Map<string, ActionIssue[]>,
  listId: string,
  actionIndex: number,
  issue: ActionIssue,
) {
  const key = `${listId}::${actionIndex}`;
  const existing = store.get(key);

  if (existing) {
    if (
      !existing.some(
        (e) =>
          e.kind === issue.kind &&
          e.slug === issue.slug &&
          e.listName === issue.listName,
      )
    ) {
      existing.push(issue);
    }
  } else {
    store.set(key, [issue]);
  }
}

function collectActionIssue(
  byAction: Map<string, ActionIssue[]>,
  err: ValidationErrorWithLocation,
  lists: Record<string, ActionEntry[]>,
): void {
  switch (err.type) {
    case "invalidExpression": {
      collectInvalidExpression(byAction, err, lists);

      break;
    }

    case "typeMismatch": {
      if (
        err.list_name != null &&
        err.action_index != null &&
        Object.hasOwn(lists, err.list_name)
      ) {
        addIssue(byAction, err.list_name, err.action_index, {
          errorType: "typeMismatch",
          kind: "type_mismatch",
        });
      }

      break;
    }

    case "undefinedList": {
      for (const [listId, entries] of Object.entries(lists)) {
        for (const [index, entry] of entries.entries()) {
          if (
            (entry.type === "call" || entry.type === "run") &&
            entry.list === err.name
          ) {
            addIssue(byAction, listId, index, {
              errorType: "undefinedList",
              kind: "undefined_list",
              listName: err.name,
            });
          }
        }
      }

      break;
    }
  }
}

function collectInvalidExpression(
  byAction: Map<string, ActionIssue[]>,
  err: Extract<ValidationErrorWithLocation, { type: "invalidExpression" }>,
  lists: Record<string, ActionEntry[]>,
): void {
  const slug = err.slug;

  if (!slug) {
    return;
  }

  const targetKind = inferSlugKind(err.message);

  if (
    err.list_name != null &&
    err.action_index != null &&
    Object.hasOwn(lists, err.list_name)
  ) {
    addIssue(byAction, err.list_name, err.action_index, {
      errorType: "invalidExpression",
      kind: targetKind,
      slug,
    });

    return;
  }

  for (const [listId, entries] of Object.entries(lists)) {
    for (const [index, entry] of entries.entries()) {
      if (actionReferencesSlug(entry, slug)) {
        addIssue(byAction, listId, index, {
          errorType: "invalidExpression",
          kind: targetKind,
          slug,
        });
      }
    }
  }
}

function inferSlugKind(message: string): ActionIssueKind {
  if (message.includes("aura")) {
    return "unknown_aura";
  }

  if (message.includes("talent")) {
    return "unknown_talent";
  }

  if (message.includes("spell")) {
    return "unknown_spell";
  }

  return "invalid_expression";
}
