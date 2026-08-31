import type { RestEndpointMethodTypes } from "@octokit/rest";

export type Assignee = NonNullable<Issue["assignees"]>[number];

export type Issue =
  RestEndpointMethodTypes["issues"]["listForRepo"]["response"]["data"][number];

export type Milestone =
  RestEndpointMethodTypes["issues"]["listMilestones"]["response"]["data"][number];

export type RoadmapData = {
  issues: Issue[];
  milestones: Milestone[];
};

export type SortMode =
  | "status-open-first"
  | "status-closed-first"
  | "updated-newest"
  | "updated-oldest"
  | "title-asc"
  | "title-desc";
