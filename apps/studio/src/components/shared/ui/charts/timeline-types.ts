import type { ReactNode } from "react";

export type TimelineEvent = {
  color?: string;
  endMs: number;
  id: string;
  label?: string;
  laneId: string;
  startMs: number;
  tooltip?: ReactNode;
};

export type TimelineLane = {
  color?: string;
  icon?: ReactNode;
  id: string;
  label?: string;
};

export { type TimelineViewport } from "wowlab-common";
