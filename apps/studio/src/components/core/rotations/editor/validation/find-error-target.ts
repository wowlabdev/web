import type { ValidationError } from "wowlab-engine";

import type { ActionEntry } from "../types";

import { visitCondition } from "../lib/visit-condition";

export type ErrorTarget =
  | { kind: "action"; listId: string; actionIndex: number }
  | { kind: "list"; listId: string };

type ValidationErrorWithLocation = {
  action_index?: number;
  list_name?: string;
  slug?: string;
} & ValidationError;

export function findErrorTarget(
  raw: ValidationError,
  lists: Record<string, ActionEntry[]>,
): ErrorTarget | null {
  const err = raw as ValidationErrorWithLocation;

  const byType = findByErrorType(err, lists);

  if (byType) {
    return byType;
  }

  if (
    err.list_name != null &&
    err.action_index != null &&
    Object.hasOwn(lists, err.list_name)
  ) {
    return {
      actionIndex: err.action_index,
      kind: "action",
      listId: err.list_name,
    };
  }

  if (err.type === "invalidExpression" && err.slug) {
    return findActionTarget(
      lists,
      (entry) =>
        (entry.type === "cast" && entry.spell === err.slug) ||
        (entry.type === "use_item" && entry.name === err.slug),
    );
  }

  return null;
}

function conditionReferencesVariable(
  node: NonNullable<ActionEntry["condition"]>,
  name: string,
): boolean {
  return visitCondition(node, {
    onVar: (n) => n.name === name,
  });
}

function findActionTarget(
  lists: Record<string, ActionEntry[]>,
  predicate: (entry: ActionEntry) => boolean,
): ErrorTarget | null {
  for (const [listId, entries] of Object.entries(lists)) {
    const idx = entries.findIndex((entry) => predicate(entry));

    if (idx !== -1) {
      return { actionIndex: idx, kind: "action", listId };
    }
  }

  return null;
}

function findByErrorType(
  err: ValidationErrorWithLocation,
  lists: Record<string, ActionEntry[]>,
): ErrorTarget | null {
  switch (err.type) {
    case "circularReference": {
      const first = err.path[0];

      return findActionTarget(lists, (entry) =>
        referencesVariable(entry, first),
      );
    }

    case "duplicateList": {
      return Object.hasOwn(lists, err.name)
        ? { kind: "list", listId: err.name }
        : null;
    }

    case "duplicateVariable": {
      return findDuplicateVariableTarget(err.name, lists);
    }

    case "emptyActionList": {
      return Object.hasOwn(lists, err.list_name)
        ? { kind: "list", listId: err.list_name }
        : null;
    }

    case "undefinedList": {
      return findActionTarget(
        lists,
        (entry) =>
          (entry.type === "call" || entry.type === "run") &&
          entry.list === err.name,
      );
    }

    case "undefinedVariable": {
      return findActionTarget(lists, (entry) =>
        referencesVariable(entry, err.name),
      );
    }

    default: {
      return null;
    }
  }
}

function findDuplicateVariableTarget(
  name: string,
  lists: Record<string, ActionEntry[]>,
): ErrorTarget | null {
  let hits = 0;

  for (const [listId, entries] of Object.entries(lists)) {
    for (const [idx, entry] of entries.entries()) {
      if (
        (entry.type === "set_var" || entry.type === "modify_var") &&
        entry.name === name
      ) {
        hits += 1;

        if (hits === 2) {
          return { actionIndex: idx, kind: "action", listId };
        }
      }
    }
  }

  return null;
}

function referencesVariable(entry: ActionEntry, name: string): boolean {
  if (entry.condition && conditionReferencesVariable(entry.condition, name)) {
    return true;
  }

  if (
    (entry.type === "set_var" || entry.type === "modify_var") &&
    entry.name === name
  ) {
    return true;
  }

  if (entry.value && conditionReferencesVariable(entry.value, name)) {
    return true;
  }

  return false;
}
