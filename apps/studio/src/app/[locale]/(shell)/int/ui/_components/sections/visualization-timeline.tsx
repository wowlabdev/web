"use client";

import {
  Timeline,
  type TimelineEvent,
  type TimelineLane,
} from "@/components/shared/ui/charts";

import { DemoSubsection } from "../demo";

const TIMELINE_DURATION_MS = 30_000;

const timelineLanes: TimelineLane[] = [
  { color: "var(--chart-1)", id: "casts", label: "Casts" },
  { color: "var(--chart-2)", id: "combustion", label: "Combustion" },
  { color: "var(--chart-3)", id: "hot-streak", label: "Hot Streak" },
  { color: "var(--chart-4)", id: "ignite", label: "Ignite" },
];

const timelineEvents: TimelineEvent[] = [
  { endMs: 1800, id: "c1", label: "Pyroblast", laneId: "casts", startMs: 0 },
  {
    endMs: 4300,
    id: "c2",
    label: "Fireball",
    laneId: "casts",
    startMs: 1800,
  },
  {
    endMs: 4300,
    id: "c3",
    label: "Hot Streak Pyro",
    laneId: "casts",
    startMs: 4300,
  },
  {
    endMs: 6800,
    id: "c4",
    label: "Fireball",
    laneId: "casts",
    startMs: 4300,
  },
  {
    endMs: 8300,
    id: "c5",
    label: "Phoenix Flames",
    laneId: "casts",
    startMs: 6800,
  },
  {
    endMs: 11_300,
    id: "c6",
    label: "Fireball",
    laneId: "casts",
    startMs: 8800,
  },
  {
    endMs: 14_000,
    id: "c7",
    label: "Scorch",
    laneId: "casts",
    startMs: 11_300,
  },
  {
    endMs: 16_500,
    id: "c8",
    label: "Fireball",
    laneId: "casts",
    startMs: 14_000,
  },
  {
    endMs: 19_000,
    id: "c9",
    label: "Fireball",
    laneId: "casts",
    startMs: 16_500,
  },
  {
    endMs: 19_000,
    id: "c10",
    label: "Hot Streak Pyro",
    laneId: "casts",
    startMs: 19_000,
  },
  {
    endMs: 22_000,
    id: "c11",
    label: "Fireball",
    laneId: "casts",
    startMs: 19_000,
  },
  {
    endMs: 24_500,
    id: "c12",
    label: "Fireball",
    laneId: "casts",
    startMs: 22_000,
  },
  {
    endMs: 26_500,
    id: "c13",
    label: "Phoenix Flames",
    laneId: "casts",
    startMs: 24_500,
  },
  {
    endMs: 30_000,
    id: "c14",
    label: "Fireball",
    laneId: "casts",
    startMs: 27_000,
  },

  {
    endMs: 12_000,
    id: "combust",
    label: "Combustion",
    laneId: "combustion",
    startMs: 0,
  },

  {
    endMs: 4300,
    id: "hs1",
    label: "Hot Streak",
    laneId: "hot-streak",
    startMs: 4300,
  },
  {
    endMs: 19_000,
    id: "hs2",
    label: "Hot Streak",
    laneId: "hot-streak",
    startMs: 19_000,
  },

  {
    endMs: 6300,
    id: "ig1",
    label: "Ignite",
    laneId: "ignite",
    startMs: 1800,
  },
  {
    endMs: 11_800,
    id: "ig2",
    label: "Ignite",
    laneId: "ignite",
    startMs: 6800,
  },
  {
    endMs: 18_500,
    id: "ig3",
    label: "Ignite",
    laneId: "ignite",
    startMs: 14_000,
  },
  {
    endMs: 26_500,
    id: "ig4",
    label: "Ignite",
    laneId: "ignite",
    startMs: 21_500,
  },
];

export function TimelineDemo() {
  return (
    <DemoSubsection title="Timeline">
      <div className="rounded-sm border p-4">
        <p className="mb-2 text-xs text-muted-foreground">
          Scroll to zoom (cursor pivot), drag to pan, reset with the top-right
          button.
        </p>
        <Timeline
          durationMs={TIMELINE_DURATION_MS}
          events={timelineEvents}
          lanes={timelineLanes}
        />
      </div>
    </DemoSubsection>
  );
}
