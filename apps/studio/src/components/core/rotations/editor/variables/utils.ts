import type { ActionEntry } from "../types";
import type { ActionRef, VariableUsage } from "./use-variable-usages";

export function findActionEntry(
  lists: Record<string, ActionEntry[]>,
  ref: ActionRef,
): ActionEntry | undefined {
  if (!Object.hasOwn(lists, ref.listId)) {
    return undefined;
  }

  return lists[ref.listId][ref.actionIndex];
}

export function firstUsage(usage: VariableUsage): ActionRef | null {
  const firstSet = usage.setBy[0] as ActionRef | undefined;

  if (firstSet) {
    return firstSet;
  }

  const firstRead = usage.readBy[0] as ActionRef | undefined;

  return firstRead ?? null;
}
