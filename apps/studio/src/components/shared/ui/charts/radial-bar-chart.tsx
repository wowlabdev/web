"use client";

import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
} from "recharts";

import type { ChartConfig } from "@/components/shared/ui/chart";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shared/ui/chart";
import { cn } from "@wowlab/shared/lib/utils";

import {
  ChartBoundary,
  ChartEmpty,
  pickFallbackColor,
  readNumber,
  readString,
  rechartsDataKey,
  resolveHeight,
} from "./internal";
import { useChartOverlay } from "./stats-overlay";

type RadialBarChartProps<TData extends object> = {
  analytics?: { showAverage?: boolean; targetValue?: number };
  className?: string;
  colorKey?: keyof TData & string;
  data: TData[];
  height?: number | string;
  nameKey: keyof TData & string;
  valueKey: keyof TData & string;
};

type RadialEntry = {
  fill: string;
  name: string;
  value: number;
};

export function RadialBarChart<TData extends object>(
  props: Readonly<RadialBarChartProps<TData>>,
) {
  return (
    <ChartBoundary className={props.className} height={props.height}>
      <RadialBarChartInner {...props} />
    </ChartBoundary>
  );
}

function RadialBarChartInner<TData extends object>({
  analytics,
  className,
  colorKey,
  data,
  height = 192,
  nameKey,
  valueKey,
}: Readonly<RadialBarChartProps<TData>>) {
  const content = useIntlayer("chartOverlay");
  const fmtNumber = useNumber();
  const resolved = resolveHeight(height);
  const showAverage = analytics?.showAverage ?? true;
  const targetValue = analytics?.targetValue ?? 100;

  const entries = useMemo<RadialEntry[]>(() => {
    const out: RadialEntry[] = [];

    for (const [index, entry] of data.entries()) {
      const name = readString(entry, nameKey);
      const value = readNumber(entry, valueKey);

      if (name === null || value === null) {
        continue;
      }

      const explicit = colorKey ? readString(entry, colorKey) : null;

      out.push({ fill: explicit ?? pickFallbackColor(index), name, value });
    }

    return out;
  }, [data, nameKey, valueKey, colorKey]);

  const chartConfig: ChartConfig = useMemo(
    () =>
      entries.reduce<ChartConfig>((acc, entry) => {
        acc[entry.name] = { color: entry.fill, label: entry.name };

        return acc;
      }, {}),
    [entries],
  );

  const values = useMemo(() => entries.map((e) => e.value), [entries]);
  const averageOverlay = useChartOverlay(values);
  const [firstValue = 0] = values;
  const average = averageOverlay?.mean ?? firstValue;

  if (entries.length === 0) {
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
        <RechartsRadialBarChart
          barSize={12}
          data={entries}
          endAngle={-270}
          innerRadius={32}
          outerRadius={104}
          startAngle={90}
        >
          <PolarAngleAxis
            domain={[0, targetValue]}
            tick={false}
            type="number"
          />
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="var(--muted-foreground)"
            strokeDasharray="4 2"
            strokeOpacity={0.4}
          />
          <ChartTooltip
            content={<ChartTooltipContent nameKey="name" />}
            cursor={false}
          />
          <RadialBar
            background
            dataKey={rechartsDataKey<RadialEntry>("value")}
          />
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </RechartsRadialBarChart>
      </ChartContainer>
      {showAverage && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold tabular-nums text-foreground">
            {fmtNumber(average)}
          </span>
          <span className="text-xs text-muted-foreground">
            {content.average.value}
          </span>
        </div>
      )}
    </div>
  );
}
