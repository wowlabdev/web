"use client";

import type { CSSProperties, ReactNode } from "react";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import type { ChartConfig } from "@/components/shared/ui/chart";

import { WasmBoundary } from "@/components/shared/wasm";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { cn } from "@wowlab/shared/lib/utils";

import type { ChartOverlayKey, ChartSeries } from "./types";

import { ALL_OVERLAY_KEYS, MOVING_AVERAGE_KEY } from "./types";

const FALLBACK_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export type ResolvedHeight = {
  className?: string;
  style?: CSSProperties;
};

export function buildChartConfig<TData>(
  series: ChartSeries<TData>[],
): ChartConfig {
  return series.reduce<ChartConfig>((acc, entry, index) => {
    acc[entry.dataKey] = {
      color: entry.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length],
      label: entry.label,
    };

    return acc;
  }, {});
}

export function ChartBoundary({
  children,
  className,
  height = 192,
}: Readonly<{
  children: ReactNode;
  className?: string;
  height?: number | string;
}>) {
  const resolved = resolveHeight(height);

  return (
    <WasmBoundary
      fallback={
        <Skeleton
          className={cn("w-full", resolved.className, className)}
          style={resolved.style}
        />
      }
    >
      {children}
    </WasmBoundary>
  );
}

export function ChartEmpty({
  className,
  height,
}: Readonly<{
  className?: string;
  height: ResolvedHeight;
}>) {
  const content = useIntlayer("chartOverlay");

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center",
        height.className,
        className,
      )}
      style={height.style}
    >
      <p className="text-sm text-muted-foreground">{content.emptyData}</p>
    </div>
  );
}

export function pickFallbackColor(index: number): string {
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

// eslint-disable-next-line sonarjs/function-return-type -- axis categories are number or string by design
export function readAxisCategory<TData>(
  point: TData,
  key: keyof TData & string,
): number | string {
  const value = readField(point, key);

  if (typeof value === "number" || typeof value === "string") {
    return value;
  }

  return 0;
}

export function readField<TData>(
  point: TData,
  key: keyof TData & string,
): unknown {
  /*
   * reason: TData has the field by type, but TS' indexed access on a generic
   * requires a record lookup. The cast is local and the result is `unknown`.
   */
  return (point as Record<string, unknown>)[key];
}

export function readNumber<TData>(
  point: TData,
  key: keyof TData & string,
): null | number {
  const value = readField(point, key);

  return typeof value === "number" ? value : null;
}

export function readString<TData>(
  point: TData,
  key: keyof TData & string,
): null | string {
  const value = readField(point, key);

  return typeof value === "string" ? value : null;
}

/**
 * Recharts' `TypedDataKey` infers its `DataPointType` generic from the
 * `dataKey` prop. When that prop's type involves a generic `TData` it lands
 * on the strict mapped-type branch and `keyof TData & string` is rejected.
 *
 * Erasing the generic association here makes inference fall through to the
 * `unknown extends DataPointType` branch of `TypedDataKey`, which accepts
 * any `string`. See
 * `node_modules/recharts/types/util/typedDataKey.d.ts`.
 */
export function rechartsDataKey<TData>(key: keyof TData & string): string {
  return key;
}

/**
 * Tailwind v4 JIT cannot see runtime-interpolated arbitrary values like
 * `h-[${n}px]`, so a numeric height MUST flow through an inline style. A
 * string height is treated as a Tailwind class token (e.g. `"h-40"`).
 */
export function resolveHeight(height: number | string): ResolvedHeight {
  if (typeof height === "number") {
    return { style: { height: `${height}px` } };
  }

  return { className: height };
}

export function useTimeSeriesOverlayMenu() {
  const content = useIntlayer("chartOverlay");
  const labels = useMemo<Record<ChartOverlayKey, string>>(
    () => ({
      mean: content.mean.value,
      movingAverage: content.movingAverage.value,
      percentileBands: content.percentileBands.value,
      stdBand: content.stdBand.value,
      trendline: content.trendline.value,
    }),
    [content],
  );
  const configAddon = useMemo<ChartConfig>(
    () => ({
      [MOVING_AVERAGE_KEY]: {
        color: "var(--muted-foreground)",
        label: content.movingAverage.value,
      },
    }),
    [content],
  );

  return {
    ariaLabel: content.overlaysLabel.value,
    configAddon,
    keys: ALL_OVERLAY_KEYS,
    labels,
  };
}
