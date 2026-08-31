"use client";

import { useMemo, useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  Line,
  ComposedChart as RechartsComposedChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shared/ui/chart";
import { cn } from "@wowlab/shared/lib/utils";

import {
  buildChartConfig,
  ChartBoundary,
  ChartEmpty,
  readAxisCategory,
  readNumber,
  rechartsDataKey,
  resolveHeight,
  useTimeSeriesOverlayMenu,
} from "./internal";
import {
  ChartOverlayMenu,
  ChartStatsOverlay,
  useChartOverlay,
  withMovingAverage,
} from "./stats-overlay";
import {
  ALL_OVERLAY_KEYS,
  type CartesianXAxisProps,
  type CartesianYAxisProps,
  type ChartAnalyticsConfig,
  type ChartOverlayKey,
  type ChartSeries,
} from "./types";

const EMPTY_VALUES: number[] = [];

export type ComposedSeries<TData> = {
  kind: "area" | "bar" | "line";
} & ChartSeries<TData>;

type ComposedChartProps<TData extends object> = {
  analytics?: ChartAnalyticsConfig<ChartOverlayKey, keyof TData & string>;
  className?: string;
  data: TData[];
  height?: number | string;
  rightAxisDataKey?: keyof TData & string;
  rightYAxis?: CartesianYAxisProps;
  series: ComposedSeries<TData>[];
  showLegend?: boolean;
  showTooltip?: boolean;
  xAxis: CartesianXAxisProps<TData>;
  yAxis?: CartesianYAxisProps;
};

export function ComposedChart<TData extends object>(
  props: Readonly<ComposedChartProps<TData>>,
) {
  return (
    <ChartBoundary className={props.className} height={props.height}>
      <ComposedChartInner {...props} />
    </ChartBoundary>
  );
}

function ComposedChartInner<TData extends object>({
  analytics,
  className,
  data,
  height = 192,
  rightAxisDataKey,
  rightYAxis,
  series,
  showLegend,
  showTooltip = true,
  xAxis,
  yAxis,
}: Readonly<ComposedChartProps<TData>>) {
  const analyticsEnabled = analytics?.enabled ?? true;
  const resolved = resolveHeight(height);
  const overlayMenu = useTimeSeriesOverlayMenu();
  const chartConfig = useMemo(
    () => ({ ...buildChartConfig(series), ...overlayMenu.configAddon }),
    [series, overlayMenu.configAddon],
  );

  const baseSeriesKey = analytics?.baseSeries ?? series[0]?.dataKey;
  const baseValues = useMemo(() => {
    if (!analyticsEnabled || !baseSeriesKey) {
      return EMPTY_VALUES;
    }

    const out: number[] = [];

    for (const point of data) {
      const value = readNumber(point, baseSeriesKey);

      if (value !== null) {
        out.push(value);
      }
    }

    return out;
  }, [data, baseSeriesKey, analyticsEnabled]);
  const overlay = useChartOverlay(baseValues);

  const [overlayKeys, setOverlayKeys] = useState<Set<ChartOverlayKey>>(
    () => new Set(analytics?.defaultKeys ?? ALL_OVERLAY_KEYS),
  );

  const mergedData = useMemo(
    () => (overlay ? withMovingAverage(data, overlay.moving_average) : data),
    [data, overlay],
  );

  if (data.length < 2) {
    return <ChartEmpty className={className} height={resolved} />;
  }

  const legendVisible = showLegend ?? series.length > 1;
  const xStart = readAxisCategory(data[0]!, xAxis.dataKey);
  const xEnd = readAxisCategory(data.at(-1)!, xAxis.dataKey);

  return (
    <div
      className={cn("relative w-full", resolved.className)}
      style={resolved.style}
    >
      {analyticsEnabled && overlay && (
        <ChartOverlayMenu
          ariaLabel={overlayMenu.ariaLabel}
          className="absolute right-1 top-1 z-10"
          keys={overlayMenu.keys}
          labels={overlayMenu.labels}
          onChange={setOverlayKeys}
          value={overlayKeys}
        />
      )}
      <ChartContainer
        className={cn("h-full w-full", className)}
        config={chartConfig}
      >
        <RechartsComposedChart data={mergedData}>
          <defs>
            {series
              .filter((s) => s.kind === "area")
              .map((s) => (
                <linearGradient
                  id={`fill-${s.dataKey}`}
                  key={s.dataKey}
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${s.dataKey})`}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${s.dataKey})`}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
          </defs>
          <CartesianGrid
            className="stroke-muted/50"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey={rechartsDataKey(xAxis.dataKey)}
            tickFormatter={xAxis.tickFormatter}
          />
          <YAxis
            allowDecimals={yAxis?.allowDecimals}
            tickFormatter={yAxis?.tickFormatter}
            width={yAxis?.width}
          />
          {rightAxisDataKey && (
            <YAxis
              allowDecimals={rightYAxis?.allowDecimals}
              orientation="right"
              tickFormatter={rightYAxis?.tickFormatter}
              width={rightYAxis?.width}
              yAxisId="right"
            />
          )}
          {showTooltip && (
            <ChartTooltip
              content={
                <ChartTooltipContent labelFormatter={xAxis.labelFormatter} />
              }
              cursor={false}
            />
          )}
          {legendVisible && <ChartLegend content={<ChartLegendContent />} />}
          {series.map((s) => {
            const yAxisId =
              s.dataKey === rightAxisDataKey ? "right" : undefined;

            if (s.kind === "area") {
              return (
                <Area
                  dataKey={rechartsDataKey(s.dataKey)}
                  fill={`url(#fill-${s.dataKey})`}
                  key={s.dataKey}
                  stroke={`var(--color-${s.dataKey})`}
                  strokeWidth={2}
                  type="monotone"
                  yAxisId={yAxisId}
                />
              );
            }

            if (s.kind === "bar") {
              return (
                <Bar
                  dataKey={rechartsDataKey(s.dataKey)}
                  fill={`var(--color-${s.dataKey})`}
                  key={s.dataKey}
                  radius={[2, 2, 0, 0]}
                  yAxisId={yAxisId}
                />
              );
            }

            return (
              <Line
                dataKey={rechartsDataKey(s.dataKey)}
                dot={false}
                key={s.dataKey}
                stroke={`var(--color-${s.dataKey})`}
                strokeWidth={2}
                type="monotone"
                yAxisId={yAxisId}
              />
            );
          })}
          {analyticsEnabled && overlay && (
            <ChartStatsOverlay
              enabled={overlayKeys}
              overlay={overlay}
              xEnd={xEnd}
              xStart={xStart}
            />
          )}
        </RechartsComposedChart>
      </ChartContainer>
    </div>
  );
}
