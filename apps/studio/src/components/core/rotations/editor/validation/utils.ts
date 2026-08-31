import type { ActionIssue, ActionIssuesIndex } from "./use-action-issues";

export function issuesForAction(
  index: ActionIssuesIndex,
  listId: string,
  actionIndex: number,
): ActionIssue[] {
  return index.byAction.get(`${listId}::${actionIndex}`) ?? [];
}
