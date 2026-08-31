import type { Issue, SortMode } from "./types";

export type SortLabelKey =
  | "statusOpenFirst"
  | "statusClosedFirst"
  | "updatedNewest"
  | "updatedOldest"
  | "titleAsc"
  | "titleDesc";

export const SORT_OPTIONS: { labelKey: SortLabelKey; value: SortMode }[] = [
  { labelKey: "statusOpenFirst", value: "status-open-first" },
  { labelKey: "statusClosedFirst", value: "status-closed-first" },
  { labelKey: "updatedNewest", value: "updated-newest" },
  { labelKey: "updatedOldest", value: "updated-oldest" },
  { labelKey: "titleAsc", value: "title-asc" },
  { labelKey: "titleDesc", value: "title-desc" },
];

export function getIssueTimestamp(issue: Issue): number {
  const stamp = new Date(issue.updated_at).getTime();

  return Number.isNaN(stamp) ? 0 : stamp;
}

export function sortIssues(issues: Issue[], mode: SortMode): Issue[] {
  const sorted = [...issues];
  const compareTitle = (a: Issue, b: Issue) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  const compareNumber = (a: Issue, b: Issue) => a.number - b.number;
  const openWeight = (issue: Issue) => (issue.state === "open" ? 0 : 1);
  const closedWeight = (issue: Issue) => (issue.state === "closed" ? 0 : 1);

  sorted.sort((a, b) => {
    if (mode === "status-open-first") {
      return (
        openWeight(a) - openWeight(b) ||
        getIssueTimestamp(b) - getIssueTimestamp(a) ||
        compareTitle(a, b) ||
        compareNumber(a, b)
      );
    }

    if (mode === "status-closed-first") {
      return (
        closedWeight(a) - closedWeight(b) ||
        getIssueTimestamp(b) - getIssueTimestamp(a) ||
        compareTitle(a, b) ||
        compareNumber(a, b)
      );
    }

    if (mode === "updated-newest") {
      return (
        getIssueTimestamp(b) - getIssueTimestamp(a) ||
        openWeight(a) - openWeight(b) ||
        compareTitle(a, b) ||
        compareNumber(a, b)
      );
    }

    if (mode === "updated-oldest") {
      return (
        getIssueTimestamp(a) - getIssueTimestamp(b) ||
        openWeight(a) - openWeight(b) ||
        compareTitle(a, b) ||
        compareNumber(a, b)
      );
    }

    if (mode === "title-asc") {
      return (
        compareTitle(a, b) ||
        openWeight(a) - openWeight(b) ||
        getIssueTimestamp(b) - getIssueTimestamp(a) ||
        compareNumber(a, b)
      );
    }

    return (
      // eslint-disable-next-line sonarjs/arguments-order -- intentional reverse-order arguments for a descending comparison
      compareTitle(b, a) ||
      openWeight(a) - openWeight(b) ||
      getIssueTimestamp(b) - getIssueTimestamp(a) ||
      compareNumber(a, b)
    );
  });

  return sorted;
}
