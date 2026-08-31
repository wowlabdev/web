"use client";

import { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shared/ui/chart";
import { cn } from "@wowlab/shared/lib/utils";

import type { ChartSeries } from "./types";

import {
  buildChartConfig,
  ChartBoundary,
  ChartEmpty,
  readNumber,
  rechartsDataKey,
  resolveHeight,
} from "./internal";
import { useChartOverlay } from "./stats-overlay";

const BASELINE_KEY = "__baseline";
const TARGET_KEY = "__target";

type RadarChartProps<TData extends object> = {
  analytics?: { showBaseline?: boolean; targetValue?: number };
  categoryKey: keyof TData & string;
  className?: string;
  data: TData[];
  height?: number | string;
  series: ChartSeries<TData>[];
};

type RadarPoint<TData> = {
  [BASELINE_KEY]: number;
  [TARGET_KEY]: number | undefined;
} & TData;

export function RadarChart<TData extends object>(
  props: Readonly<RadarChartProps<TData>>,
) {
  return (
    <ChartBoundary className={props.className} height={props.height}>
      <RadarChartInner {...props} />
    </ChartBoundary>
  );
}

function RadarChartInner<TData extends object>({
  analytics,
  categoryKey,
  className,
  data,
  height = 192,
  series,
}: Readonly<RadarChartProps<TData>>) {
  const resolved = resolveHeight(height);
  const showBaseline = analytics?.showBaseline ?? true;
  const targetValue = analytics?.targetValue;

  const baselineValues = useMemo(() => {
    const firstKey = series[0]?.dataKey;

    if (!firstKey) {
      return [];
    }

    const out: number[] = [];

    for (const entry of data) {
      const v = readNumber(entry, firstKey);

      if (v !== null) {
        out.push(v);
      }
    }

    return out;
  }, [data, series]);
  const baselineOverlay = useChartOverlay(baselineValues);
  const [firstBaseline = 0] = baselineValues;
  const baseline = baselineOverlay?.mean ?? firstBaseline;

  const radarData = useMemo<RadarPoint<TData>[]>(
    () =>
      data.map((entry) => ({
        ...entry,
        [BASELINE_KEY]: baseline,
        [TARGET_KEY]: targetValue,
      })),
    [data, baseline, targetValue],
  );

  const chartConfig = useMemo(() => buildChartConfig(series), [series]);

  if (data.length === 0) {
    return <ChartEmpty className={className} height={resolved} />;
  }

  return (
    <div
      className={cn("relative w-full", resolved.className)}
      style={resolved.style}
    >
      <ChartContainer
        className={cn("h-full w-full", className)}
        config={chartConfig}
      >
        <RechartsRadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey={rechartsDataKey(categoryKey)} />
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          {series.map((s) => (
            <Radar
              dataKey={rechartsDataKey(s.dataKey)}
              fill={`var(--color-${s.dataKey})`}
              fillOpacity={0.4}
              key={s.dataKey}
              stroke={`var(--color-${s.dataKey})`}
            />
          ))}
          {showBaseline && (
            <Radar
              dataKey={BASELINE_KEY}
              fill="none"
              stroke="var(--muted-foreground)"
              strokeDasharray="4 2"
            />
          )}
          {targetValue !== undefined && (
            <Radar
              dataKey={TARGET_KEY}
              fill="none"
              stroke="var(--muted-foreground)"
              strokeDasharray="6 3"
            />
          )}
          <ChartLegend content={<ChartLegendContent />} />
        </RechartsRadarChart>
      </ChartContainer>
    </div>
  );
}
