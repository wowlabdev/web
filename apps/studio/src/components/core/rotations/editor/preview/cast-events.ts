import type { IterationTrace } from "wowlab-engine";

import { formatSlug } from "@/components/core/rotations/format-slug";

import type { ActionEntry } from "../types";

import { walkDecisions } from "./walk-decisions";

export type ActionResolver = (
  listId: string,
  actionIndex: number,
) => null | ResolvedAction;

export type CastEvent = {
  actionIndex: number;
  castTimeMs: number;
  listId: string;
  spellLabel: string;
  spellSlug: null | string;
  timeMs: number;
};

export type ResolvedAction = {
  castTimeMs: number;
  label: string;
  slug: null | string;
};

export function buildCastEvents(
  trace: IterationTrace,
  resolver: ActionResolver,
): CastEvent[] {
  const out: CastEvent[] = [];

  walkDecisions(trace.decisions, (decision) => {
    if (decision.firedActionIndex === undefined) {
      return;
    }

    const resolved = resolver(decision.listId, decision.firedActionIndex);

    if (resolved === null) {
      return;
    }

    out.push({
      actionIndex: decision.firedActionIndex,
      castTimeMs: resolved.castTimeMs,
      listId: decision.listId,
      spellLabel: resolved.label,
      spellSlug: resolved.slug,
      timeMs: decision.timeMs,
    });
  });

  return out;
}

export function resolveAction(
  lists: Record<string, ActionEntry[]>,
  castTimeBySlug: Map<string, number>,
  listId: string,
  actionIndex: number,
): null | ResolvedAction {
  if (!Object.hasOwn(lists, listId)) {
    return null;
  }

  const action = lists[listId][actionIndex] as ActionEntry | undefined;

  if (!action) {
    return null;
  }

  switch (action.type) {
    case "call":
    case "modify_var":
    case "run":
    case "set_var": {
      return null;
    }

    case "cast": {
      const slug = action.spell ?? null;
      const label = slug ? formatSlug(slug) : "cast";
      const castTimeMs = slug ? (castTimeBySlug.get(slug) ?? 0) : 0;

      return { castTimeMs, label, slug };
    }

    case "pool": {
      return { castTimeMs: 0, label: "pool", slug: null };
    }

    case "use_item": {
      return {
        castTimeMs: 0,
        label: action.name ? formatSlug(action.name) : "use_item",
        slug: null,
      };
    }

    case "use_trinket": {
      return {
        castTimeMs: 0,
        label: `trinket ${action.slot ?? "?"}`,
        slug: null,
      };
    }

    case "wait": {
      return { castTimeMs: 0, label: "wait", slug: null };
    }

    case "wait_until": {
      return { castTimeMs: 0, label: "wait_until", slug: null };
    }
  }
}
