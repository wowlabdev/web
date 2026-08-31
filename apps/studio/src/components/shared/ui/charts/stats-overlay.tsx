"use client";

import type { ChartOverlayView, ScatterOverlayView } from "wowlab-common";

import { Layers } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";
import { Line, ReferenceArea, ReferenceLine } from "recharts";

import { useCommon } from "@/components/shared/wasm";
import { computeChartOverlay, computeScatterOverlay } from "@/lib/wasm/api";
import { Button } from "@wowlab/shared/components/ui/button";
import { Checkbox } from "@wowlab/shared/components/ui/checkbox";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@wowlab/shared/components/ui/popover";
import { Separator } from "@wowlab/shared/components/ui/separator";
import { cn } from "@wowlab/shared/lib/utils";

import type { ChartOverlayKey } from "./types";

import { MOVING_AVERAGE_KEY } from "./types";

type ChartOverlayMenuProps<Key extends string> = {
  ariaLabel: string;
  className?: string;
  keys: readonly Key[];
  labels: Record<Key, string>;
  onChange: (next: Set<Key>) => void;
  value: ReadonlySet<Key>;
};

type ChartStatsOverlayProps = {
  color?: string;
  enabled?: ReadonlySet<ChartOverlayKey>;
  overlay: ChartOverlayView;
  xEnd: number | string;
  xStart: number | string;
};

export function ChartOverlayMenu<Key extends string>({
  ariaLabel,
  className,
  keys,
  labels,
  onChange,
  value,
}: Readonly<ChartOverlayMenuProps<Key>>) {
  const content = useIntlayer("chartOverlay");
  const toggle = (key: Key) => {
    const next = new Set(value);

    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }

    onChange(next);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label={ariaLabel}
          className={cn("size-7", className)}
          size="icon"
          variant="ghost"
        >
          <Layers className="size-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 gap-2">
        <div className="flex items-center gap-1">
          <Button
            className="h-7 flex-1"
            disabled={value.size === keys.length}
            onClick={() => onChange(new Set(keys))}
            size="sm"
            variant="ghost"
          >
            {content.overlaysShowAll}
          </Button>
          <Button
            className="h-7 flex-1"
            disabled={value.size === 0}
            onClick={() => onChange(new Set())}
            size="sm"
            variant="ghost"
          >
            {content.overlaysHideAll}
          </Button>
        </div>
        <Separator />
        {keys.map((key) => (
          <Label htmlFor={`overlay-${key}`} key={key}>
            <Checkbox
              checked={value.has(key)}
              id={`overlay-${key}`}
              onCheckedChange={() => toggle(key)}
            />
            <span>{labels[key]}</span>
          </Label>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function ChartStatsOverlay({
  color = "var(--muted-foreground)",
  enabled,
  overlay,
  xEnd,
  xStart,
}: Readonly<ChartStatsOverlayProps>) {
  const content = useIntlayer("chartOverlay");
  const isOn = (key: ChartOverlayKey) => (enabled ? enabled.has(key) : true);
  const trendlineLabel = `${content.rSquared.value} ${overlay.trendline_r_squared.toFixed(2)}`;

  return (
    <>
      {isOn("stdBand") && (
        <ReferenceArea
          fill={color}
          fillOpacity={0.08}
          ifOverflow="extendDomain"
          stroke="none"
          y1={overlay.mean - overlay.std_dev}
          y2={overlay.mean + overlay.std_dev}
        />
      )}
      {isOn("percentileBands") && (
        <>
          <ReferenceArea
            fill={color}
            fillOpacity={0.05}
            ifOverflow="extendDomain"
            stroke="none"
            y1={overlay.p25}
            y2={overlay.p75}
          />
          <ReferenceLine
            ifOverflow="extendDomain"
            stroke={color}
            strokeDasharray="2 2"
            strokeOpacity={0.6}
            y={overlay.p99}
          />
        </>
      )}
      {isOn("mean") && (
        <ReferenceLine
          ifOverflow="extendDomain"
          label={{
            fill: color,
            fontSize: 10,
            position: "insideTopRight",
            value: content.mean.value,
          }}
          stroke={color}
          strokeDasharray="4 2"
          strokeOpacity={0.7}
          y={overlay.mean}
        />
      )}
      {isOn("trendline") && (
        <ReferenceLine
          ifOverflow="extendDomain"
          label={{
            fill: color,
            fontSize: 10,
            position: "insideBottomRight",
            value: trendlineLabel,
          }}
          segment={[
            { x: xStart, y: overlay.trendline_start },
            { x: xEnd, y: overlay.trendline_end },
          ]}
          stroke={color}
          strokeDasharray="6 3"
          strokeOpacity={0.7}
        />
      )}
      {isOn("movingAverage") && (
        <Line
          dataKey={MOVING_AVERAGE_KEY}
          dot={false}
          isAnimationActive={false}
          stroke={color}
          strokeOpacity={0.9}
          strokeWidth={1.5}
          type="monotone"
        />
      )}
    </>
  );
}

export function useChartOverlay(yValues: number[]): ChartOverlayView | null {
  const common = useCommon();

  return useMemo(() => {
    if (yValues.length < 2) {
      return null;
    }

    return computeChartOverlay(common, yValues);
  }, [common, yValues]);
}

export function useScatterOverlay(
  xs: number[],
  ys: number[],
): null | ScatterOverlayView {
  const common = useCommon();

  return useMemo(() => {
    if (xs.length < 2 || ys.length < 2) {
      return null;
    }

    const view = computeScatterOverlay(common, xs, ys);

    return view.valid ? view : null;
  }, [common, xs, ys]);
}

export function withMovingAverage<T extends object>(
  data: T[],
  movingAverage: number[],
): ({ [MOVING_AVERAGE_KEY]?: number } & T)[] {
  return data.map((point, i) => ({
    ...point,
    [MOVING_AVERAGE_KEY]: movingAverage[i],
  }));
}
