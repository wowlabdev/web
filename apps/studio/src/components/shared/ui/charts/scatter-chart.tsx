"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  ScatterChart as RechartsScatterChart,
  ReferenceLine,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import type { ChartConfig } from "@/components/shared/ui/chart";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shared/ui/chart";
import { cn } from "@wowlab/shared/lib/utils";

import {
  ChartBoundary,
  ChartEmpty,
  readNumber,
  rechartsDataKey,
  resolveHeight,
} from "./internal";
import { ChartOverlayMenu, useScatterOverlay } from "./stats-overlay";
import { type ChartAnalyticsConfig } from "./types";

export type ScatterOverlayKey = "meanX" | "meanY" | "regression";

const ALL_SCATTER_KEYS: readonly ScatterOverlayKey[] = [
  "meanX",
  "meanY",
  "regression",
];

const EMPTY_VALUES: number[] = [];

type ScatterChartProps<TData extends object> = {
  analytics?: ChartAnalyticsConfig<ScatterOverlayKey, never>;
  className?: string;
  color?: string;
  data: TData[];
  height?: number | string;
  name?: string;
  xKey: keyof TData & string;
  yKey: keyof TData & string;

  /** Bubble-size key (optional). Maps to ZAxis with range [40, 200]. */
  zKey?: keyof TData & string;
};

export function ScatterChart<TData extends object>(
  props: Readonly<ScatterChartProps<TData>>,
) {
  return (
    <ChartBoundary className={props.className} height={props.height}>
      <ScatterChartInner {...props} />
    </ChartBoundary>
  );
}

function ScatterChartInner<TData extends object>({
  analytics,
  className,
  color = "var(--chart-1)",
  data,
  height = 192,
  name,
  xKey,
  yKey,
  zKey,
}: Readonly<ScatterChartProps<TData>>) {
  const content = useIntlayer("chartOverlay");
  const analyticsEnabled = analytics?.enabled ?? true;
  const resolved = resolveHeight(height);

  const seriesKey = name ?? yKey;
  const chartConfig: ChartConfig = useMemo(
    () => ({ [seriesKey]: { color, label: seriesKey } }),
    [color, seriesKey],
  );

  const { xs, ys } = useMemo(() => {
    if (!analyticsEnabled) {
      return { xs: EMPTY_VALUES, ys: EMPTY_VALUES };
    }

    const cleanX: number[] = [];
    const cleanY: number[] = [];

    for (const point of data) {
      const x = readNumber(point, xKey);
      const y = readNumber(point, yKey);

      if (x !== null && y !== null) {
        cleanX.push(x);
        cleanY.push(y);
      }
    }

    return { xs: cleanX, ys: cleanY };
  }, [analyticsEnabled, data, xKey, yKey]);
  const overlay = useScatterOverlay(xs, ys);

  const [overlayKeys, setOverlayKeys] = useState<Set<ScatterOverlayKey>>(
    () => new Set(analytics?.defaultKeys ?? ALL_SCATTER_KEYS),
  );

  if (data.length < 2) {
    return <ChartEmpty className={className} height={resolved} />;
  }

  const labels: Record<ScatterOverlayKey, string> = {
    meanX: content.meanX.value,
    meanY: content.meanY.value,
    regression: content.regression.value,
  };

  const showMenu = analyticsEnabled && overlay !== null;
  const regressionLabel =
    overlay === null
      ? null
      : `${content.rSquared.value} ${overlay.r_squared.toFixed(2)}`;
  const overlayColor = "var(--muted-foreground)";

  return (
    <div
      className={cn("relative w-full", resolved.className)}
      style={resolved.style}
    >
      {showMenu && (
        <ChartOverlayMenu
          ariaLabel={content.overlaysLabel.value}
          className="absolute right-1 top-1 z-10"
          keys={ALL_SCATTER_KEYS}
          labels={labels}
          onChange={setOverlayKeys}
          value={overlayKeys}
        />
      )}
      <ChartContainer
        className={cn("h-full w-full", className)}
        config={chartConfig}
      >
        <RechartsScatterChart>
          <CartesianGrid
            className="stroke-muted/50"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis dataKey={rechartsDataKey(xKey)} name={xKey} type="number" />
          <YAxis dataKey={rechartsDataKey(yKey)} name={yKey} type="number" />
          {zKey && (
            <ZAxis
              dataKey={rechartsDataKey(zKey)}
              name={zKey}
              range={[40, 200]}
              type="number"
            />
          )}
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ strokeDasharray: "3 3" }}
          />
          <Scatter data={data} fill={color} name={seriesKey} />
          {analyticsEnabled && overlay && overlayKeys.has("meanX") && (
            <ReferenceLine
              ifOverflow="extendDomain"
              label={{
                fill: overlayColor,
                fontSize: 10,
                position: "insideTopLeft",
                value: content.meanX.value,
              }}
              stroke={overlayColor}
              strokeDasharray="4 2"
              strokeOpacity={0.7}
              x={overlay.mean_x}
            />
          )}
          {analyticsEnabled && overlay && overlayKeys.has("meanY") && (
            <ReferenceLine
              ifOverflow="extendDomain"
              label={{
                fill: overlayColor,
                fontSize: 10,
                position: "insideTopRight",
                value: content.meanY.value,
              }}
              stroke={overlayColor}
              strokeDasharray="4 2"
              strokeOpacity={0.7}
              y={overlay.mean_y}
            />
          )}
          {analyticsEnabled &&
            overlay &&
            overlayKeys.has("regression") &&
            regressionLabel && (
              <ReferenceLine
                ifOverflow="extendDomain"
                label={{
                  fill: overlayColor,
                  fontSize: 10,
                  position: "insideBottomRight",
                  value: regressionLabel,
                }}
                segment={[
                  {
                    x: overlay.x_min,
                    y: overlay.slope * overlay.x_min + overlay.intercept,
                  },
                  {
                    x: overlay.x_max,
                    y: overlay.slope * overlay.x_max + overlay.intercept,
                  },
                ]}
                stroke={overlayColor}
                strokeDasharray="6 3"
                strokeOpacity={0.8}
              />
            )}
        </RechartsScatterChart>
      </ChartContainer>
    </div>
  );
}
