"use client";

import type { TimelineViewport } from "wowlab-common";

import { useSize } from "ahooks";
import { MaximizeIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo, useRef } from "react";

import { Button } from "@wowlab/shared/components/ui/button";
import { cn } from "@wowlab/shared/lib/utils";

import type { TimelineEvent, TimelineLane } from "./timeline-types";

import { useTimelineTickFormatter } from "./formatters";
import { ChartBoundary, ChartEmpty, resolveHeight } from "./internal";
import {
  TimelineEventTiles,
  TimelineLaneLabels,
  TimelineTicks,
} from "./timeline-svg";
import { RIGHT_GUTTER, useTimelineViewport } from "./use-timeline-viewport";

const DEFAULT_LANE_HEIGHT = 24;
const DEFAULT_AXIS_HEIGHT = 20;
const DEFAULT_GUTTER_WIDTH = 80;

type TimelineProps = {
  axisHeight?: number;
  className?: string;
  durationMs: number;
  events: TimelineEvent[];
  gutterWidth?: number;
  laneHeight?: number;

  /** Explicit lane order + labels. If omitted, lanes are inferred from event laneIds in encounter order. */
  lanes?: TimelineLane[];
  onSelect?: (event: TimelineEvent) => void;
  onViewportChange?: (viewport: TimelineViewport) => void;
  selectedId?: string;

  /** Controlled viewport. If omitted, the component manages its own zoom/pan. */
  viewport?: TimelineViewport;
};

export function Timeline(props: Readonly<TimelineProps>) {
  const axisHeight = props.axisHeight ?? DEFAULT_AXIS_HEIGHT;

  return (
    <ChartBoundary
      className={props.className}
      height={axisHeight + DEFAULT_LANE_HEIGHT}
    >
      <TimelineInner {...props} />
    </ChartBoundary>
  );
}

function TimelineInner({
  axisHeight = DEFAULT_AXIS_HEIGHT,
  className,
  durationMs,
  events,
  gutterWidth = DEFAULT_GUTTER_WIDTH,
  laneHeight = DEFAULT_LANE_HEIGHT,
  lanes: explicitLanes,
  onSelect,
  onViewportChange,
  selectedId,
  viewport: controlledViewport,
}: Readonly<TimelineProps>) {
  const content = useIntlayer("chartOverlay");
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useSize(containerRef);
  const containerWidth = Math.max(0, size?.width ?? 0);
  const fmtTick = useTimelineTickFormatter();

  const { endDrag, isFit, metrics, onPointerDown, onPointerMove, reset } =
    useTimelineViewport({
      containerRef,
      containerWidth,
      durationMs,
      gutterWidth,
      onViewportChange,
      viewport: controlledViewport,
    });
  const {
    clampedPanMs,
    pxPerMs,
    safeZoom,
    ticks,
    visibleEndMs,
    visibleStartMs,
  } = metrics;

  const resolvedLanes = useMemo<TimelineLane[]>(() => {
    if (explicitLanes) {
      return explicitLanes;
    }

    const seen = new Set<string>();
    const out: TimelineLane[] = [];

    for (const event of events) {
      if (!seen.has(event.laneId)) {
        seen.add(event.laneId);
        out.push({ id: event.laneId });
      }
    }

    return out;
  }, [events, explicitLanes]);
  const laneIndex = useMemo<Map<string, number>>(
    () => new Map(resolvedLanes.map((lane, i) => [lane.id, i])),
    [resolvedLanes],
  );

  const visibleEvents = useMemo(() => {
    if (pxPerMs <= 0) {
      return [];
    }

    return events.filter(
      (event) => event.endMs >= visibleStartMs && event.startMs <= visibleEndMs,
    );
  }, [events, pxPerMs, visibleStartMs, visibleEndMs]);

  if (events.length === 0 || durationMs <= 0) {
    return (
      <ChartEmpty
        className={className}
        height={resolveHeight(axisHeight + DEFAULT_LANE_HEIGHT)}
      />
    );
  }

  const totalHeight = axisHeight + resolvedLanes.length * laneHeight;
  const zoomPercent = Math.round(safeZoom * 100);

  return (
    <div className={cn("relative w-full select-none", className)}>
      <div className="absolute right-0 top-0 z-10 flex items-center gap-1 text-[10px] text-muted-foreground">
        <span className="tabular-nums">{zoomPercent}%</span>
        <Button
          aria-label={content.timelineResetZoom.value}
          className="size-6"
          disabled={isFit}
          onClick={reset}
          size="icon"
          variant="ghost"
        >
          <MaximizeIcon className="size-3" />
        </Button>
      </div>
      <div
        className="relative w-full cursor-grab touch-none overflow-hidden active:cursor-grabbing"
        onPointerCancel={endDrag}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        ref={containerRef}
        style={{ height: totalHeight }}
      >
        <svg
          aria-label={content.timelineAriaLabel.value}
          height={totalHeight}
          role="img"
          width={containerWidth}
        >
          <line
            className="stroke-border"
            x1={gutterWidth}
            x2={containerWidth - RIGHT_GUTTER}
            y1={axisHeight}
            y2={axisHeight}
          />
          <TimelineTicks
            axisHeight={axisHeight}
            clampedPanMs={clampedPanMs}
            containerWidth={containerWidth}
            fmtTick={fmtTick}
            gutterWidth={gutterWidth}
            pxPerMs={pxPerMs}
            ticks={ticks}
            totalHeight={totalHeight}
          />
          <TimelineLaneLabels
            axisHeight={axisHeight}
            laneHeight={laneHeight}
            lanes={resolvedLanes}
          />
          <TimelineEventTiles
            axisHeight={axisHeight}
            clampedPanMs={clampedPanMs}
            events={visibleEvents}
            fmtTick={fmtTick}
            gutterWidth={gutterWidth}
            laneHeight={laneHeight}
            laneIndex={laneIndex}
            lanes={resolvedLanes}
            onSelect={onSelect}
            pxPerMs={pxPerMs}
            selectedId={selectedId}
          />
        </svg>
      </div>
    </div>
  );
}
