"use client";

import type { SpecIntrospection } from "wowlab-common";
import type { IterationTrace } from "wowlab-engine";

import { useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import {
  Timeline,
  type TimelineEvent,
  type TimelineViewport,
} from "@/components/shared/ui/charts";

import { useEditorDocument, useEditorUi } from "../editor-store-provider";
import { buildCastEvents, type CastEvent, resolveAction } from "./cast-events";
import { stringHashToHsl } from "./palette";

const CAST_LANE_ID = "casts";

type TimelineTrackProps = {
  intro: null | SpecIntrospection;
  onViewportChange: (viewport: TimelineViewport) => void;
  trace: IterationTrace | null;
  viewport: TimelineViewport;
};

export function TimelineTrack({
  intro,
  onViewportChange,
  trace,
  viewport,
}: Readonly<TimelineTrackProps>) {
  const content = useIntlayer("rotationEditor");
  const lists = useEditorDocument((s) => s.script.lists);
  const selectionFocus = useEditorUi((s) => s.selectionFocus);
  const setSelectionFocus = useEditorUi((s) => s.setSelectionFocus);

  const castTimeBySlug = useMemo<Map<string, number>>(() => {
    const map = new Map<string, number>();

    if (!intro) {
      return map;
    }

    for (const spell of intro.spells) {
      map.set(spell.slug, spell.cast_time_ms);
    }

    return map;
  }, [intro]);

  const lookup = useMemoizedFn((listId: string, actionIndex: number) =>
    resolveAction(lists, castTimeBySlug, listId, actionIndex),
  );

  const events = useMemo<CastEvent[]>(
    () => (trace ? buildCastEvents(trace, lookup) : []),
    [trace, lookup],
  );

  const timelineEvents = useMemo<TimelineEvent[]>(
    () =>
      events.map((event, i) => ({
        color: stringHashToHsl(event.spellLabel),
        endMs: event.timeMs + Math.max(event.castTimeMs, 0),
        id: `${event.listId}-${event.actionIndex}-${i}`,
        label: event.spellLabel,
        laneId: CAST_LANE_ID,
        startMs: event.timeMs,
      })),
    [events],
  );

  const selectedId = useMemo(() => {
    if (!selectionFocus) {
      return;
    }

    const match = events.findIndex(
      (event) =>
        event.listId === selectionFocus.listId &&
        event.actionIndex === selectionFocus.actionIndex,
    );

    return match === -1
      ? undefined
      : `${selectionFocus.listId}-${selectionFocus.actionIndex}-${match}`;
  }, [events, selectionFocus]);

  const handleSelect = useMemoizedFn((event: TimelineEvent) => {
    const match = timelineEvents.find((te) => te.id === event.id);

    if (!match) {
      return;
    }

    const cast = events.find(
      (_, i) =>
        `${events[i].listId}-${events[i].actionIndex}-${i}` === match.id,
    );

    if (cast) {
      setSelectionFocus({
        actionIndex: cast.actionIndex,
        listId: cast.listId,
      });
    }
  });

  if (!trace) {
    return null;
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {content.previewTimelineEmpty}
      </p>
    );
  }

  return (
    <Timeline
      durationMs={trace.durationMs}
      events={timelineEvents}
      lanes={[{ id: CAST_LANE_ID, label: content.previewTimelineLane.value }]}
      onSelect={handleSelect}
      onViewportChange={onViewportChange}
      selectedId={selectedId}
      viewport={viewport}
    />
  );
}
