"use client";

import type { TimelineMetrics } from "wowlab-common";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wowlab/shared/components/ui/tooltip";
import { cn } from "@wowlab/shared/lib/utils";

import type { TimelineEvent, TimelineLane } from "./timeline-types";

import { pickFallbackColor } from "./internal";
import { RIGHT_GUTTER } from "./use-timeline-viewport";

const TILE_VERTICAL_INSET = 3;
const MIN_TILE_WIDTH = 4;
const MAX_LANE_LABEL_CHARS = 12;
const LANE_ICON_SIZE = 18;

type TickFormatter = (ms: number) => string;

type TimelineEventTilesProps = {
  axisHeight: number;
  clampedPanMs: number;
  events: TimelineEvent[];
  fmtTick: TickFormatter;
  gutterWidth: number;
  laneHeight: number;
  laneIndex: Map<string, number>;
  lanes: TimelineLane[];
  onSelect?: (event: TimelineEvent) => void;
  pxPerMs: number;
  selectedId?: string;
};

type TimelineLaneLabelsProps = {
  axisHeight: number;
  laneHeight: number;
  lanes: TimelineLane[];
};

type TimelineTicksProps = {
  axisHeight: number;
  clampedPanMs: number;
  containerWidth: number;
  fmtTick: TickFormatter;
  gutterWidth: number;
  pxPerMs: number;
  ticks: TimelineMetrics["ticks"];
  totalHeight: number;
};

export function TimelineEventTiles({
  axisHeight,
  clampedPanMs,
  events,
  fmtTick,
  gutterWidth,
  laneHeight,
  laneIndex,
  lanes,
  onSelect,
  pxPerMs,
  selectedId,
}: Readonly<TimelineEventTilesProps>) {
  return (
    <>
      {events.map((event) => {
        const i = laneIndex.get(event.laneId) ?? 0;
        const x = gutterWidth + (event.startMs - clampedPanMs) * pxPerMs;
        const rawWidth = (event.endMs - event.startMs) * pxPerMs;
        const width = Math.max(MIN_TILE_WIDTH, rawWidth);
        const y = axisHeight + i * laneHeight + TILE_VERTICAL_INSET;
        const tileH = laneHeight - TILE_VERTICAL_INSET * 2;
        const lane = lanes[i];
        const color = event.color ?? lane.color ?? pickFallbackColor(i);
        const isSelected = selectedId === event.id;

        return (
          <Tooltip key={event.id}>
            <TooltipTrigger asChild>
              <g
                aria-label={event.label ?? event.id}
                className="cursor-pointer focus:outline-none"
                onClick={onSelect ? () => onSelect(event) : undefined}
                onKeyDown={(syntheticEvent) => {
                  if (
                    onSelect &&
                    (syntheticEvent.key === "Enter" ||
                      syntheticEvent.key === " ")
                  ) {
                    syntheticEvent.preventDefault();
                    onSelect(event);
                  }
                }}
                role={onSelect ? "button" : "img"}
                tabIndex={onSelect ? 0 : undefined}
              >
                <rect
                  className={cn(
                    "transition-opacity",
                    isSelected ? "opacity-100" : "opacity-80 hover:opacity-100",
                  )}
                  fill={color}
                  height={tileH}
                  rx={2}
                  stroke={isSelected ? "currentColor" : undefined}
                  strokeWidth={isSelected ? 2 : 0}
                  width={width}
                  x={x}
                  y={y}
                />
              </g>
            </TooltipTrigger>
            <TooltipContent>
              {event.tooltip ?? (
                <div className="space-y-0.5 text-xs">
                  {event.label && (
                    <div className="font-medium">{event.label}</div>
                  )}
                  <div className="text-muted-foreground">
                    {fmtTick(event.startMs)}
                    {event.endMs > event.startMs &&
                      ` – ${fmtTick(event.endMs)}`}
                  </div>
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </>
  );
}

export function TimelineLaneLabels({
  axisHeight,
  laneHeight,
  lanes,
}: Readonly<TimelineLaneLabelsProps>) {
  return (
    <>
      {lanes.map((lane, i) => {
        if (lane.icon) {
          const iconY =
            axisHeight + i * laneHeight + (laneHeight - LANE_ICON_SIZE) / 2;

          return (
            <foreignObject
              height={LANE_ICON_SIZE}
              key={lane.id}
              width={LANE_ICON_SIZE}
              x={4}
              y={iconY}
            >
              {lane.icon}
            </foreignObject>
          );
        }

        const y = axisHeight + i * laneHeight + laneHeight / 2 + 3;
        const raw = lane.label ?? lane.id;
        const text =
          raw.length > MAX_LANE_LABEL_CHARS
            ? `${raw.slice(0, MAX_LANE_LABEL_CHARS - 1)}…`
            : raw;

        return (
          <text
            className="fill-muted-foreground text-[10px]"
            key={lane.id}
            x={4}
            y={y}
          >
            {text}
          </text>
        );
      })}
    </>
  );
}

export function TimelineTicks({
  axisHeight,
  clampedPanMs,
  containerWidth,
  fmtTick,
  gutterWidth,
  pxPerMs,
  ticks,
  totalHeight,
}: Readonly<TimelineTicksProps>) {
  return (
    <>
      {[...ticks].map((tickMs) => {
        const x = gutterWidth + (tickMs - clampedPanMs) * pxPerMs;

        if (x < gutterWidth - 1 || x > containerWidth - RIGHT_GUTTER + 1) {
          return null;
        }

        return (
          <g key={tickMs}>
            <line
              className="stroke-border/60"
              strokeDasharray="2 4"
              x1={x}
              x2={x}
              y1={axisHeight}
              y2={totalHeight}
            />
            <text
              className="fill-muted-foreground text-[10px]"
              x={x + 2}
              y={axisHeight - 4}
            >
              {fmtTick(tickMs)}
            </text>
          </g>
        );
      })}
    </>
  );
}
