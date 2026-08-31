"use client";

import type { IterationTrace, ResourceSample } from "wowlab-engine";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import {
  BarChart,
  type ChartSeries,
  useChartTimeFormatters,
} from "@/components/shared/ui/charts";
import { useIsMobile } from "@wowlab/shared/hooks/use-is-mobile";

import { stringHashToHsl } from "./palette";

// ~80 bars keeps small frequent gains legible next to large sparse spends.
const TARGET_BUCKETS = 80;
const NATIVE_SAMPLE_MS = 100;

type ChartPoint = { timeMs: number } & Record<string, number>;

type ResourceFluxGraphProps = {
  trace: IterationTrace | null;
};

export function ResourceFluxGraph({ trace }: Readonly<ResourceFluxGraphProps>) {
  const content = useIntlayer("rotationEditor");
  const { labelFormatter, tickFormatter } = useChartTimeFormatters();
  const isMobile = useIsMobile();
  const { data, resourceNames } = useMemo(
    () => bucketFlux(trace?.resourceSamples ?? [], trace?.durationMs ?? 0),
    [trace?.resourceSamples, trace?.durationMs],
  );

  const series = useMemo<ChartSeries<ChartPoint>[]>(() => {
    const gainWord = content.previewResourcesGainLabel.value;
    const lossWord = content.previewResourcesLossLabel.value;

    return resourceNames.flatMap((name, i) => [
      {
        color: stringHashToHsl(name),
        dataKey: `gain${i}`,
        label: `${name} · ${gainWord}`,
      },
      {
        color: stringHashToHsl(name, 65, 38),
        dataKey: `loss${i}`,
        label: `${name} · ${lossWord}`,
      },
    ]);
  }, [
    resourceNames,
    content.previewResourcesGainLabel,
    content.previewResourcesLossLabel,
  ]);

  if (!trace) {
    return null;
  }

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {content.previewResourcesEmpty}
      </p>
    );
  }

  return (
    <BarChart
      analytics={{ enabled: false }}
      data={data}
      height={isMobile ? 140 : 180}
      series={series}
      showLegend
      stackId="flux"
      xAxis={{ dataKey: "timeMs", labelFormatter, tickFormatter }}
      yAxis={{ tickFormatter: fluxTickFormatter }}
    />
  );
}

function bucketFlux(
  samples: ResourceSample[],
  durationMs: number,
): { data: ChartPoint[]; resourceNames: string[] } {
  if (samples.length === 0) {
    return { data: [], resourceNames: [] };
  }

  const resourceNames: string[] = [];

  for (const sample of samples) {
    if (!resourceNames.includes(sample.resourceName)) {
      resourceNames.push(sample.resourceName);
    }
  }

  const indexByName = new Map(resourceNames.map((name, i) => [name, i]));
  const sorted = [...samples].sort((a, b) => a.timeMs - b.timeMs);
  const spanMs = Math.max(durationMs, sorted.at(-1)!.timeMs);
  const bucketMs = chooseBucketMs(spanMs);

  const byBucket = new Map<number, Record<string, number>>();

  for (const sample of sorted) {
    const i = indexByName.get(sample.resourceName)!;
    const bucket = Math.floor(sample.timeMs / bucketMs);
    const slot = byBucket.get(bucket) ?? {};

    slot[`gain${i}`] = (slot[`gain${i}`] ?? 0) + sample.gain;
    slot[`loss${i}`] = (slot[`loss${i}`] ?? 0) + sample.loss;
    byBucket.set(bucket, slot);
  }

  const lastBucket = Math.floor(spanMs / bucketMs);
  const data: ChartPoint[] = [];

  for (let bucket = 0; bucket <= lastBucket; bucket++) {
    const slot = byBucket.get(bucket) ?? {};
    const point: ChartPoint = { timeMs: bucket * bucketMs };

    for (let i = 0; i < resourceNames.length; i++) {
      point[`gain${i}`] = slot[`gain${i}`] ?? 0;
      // Losses render downward, so store them as a negative magnitude.
      point[`loss${i}`] = -(slot[`loss${i}`] ?? 0);
    }

    data.push(point);
  }

  return { data, resourceNames };
}

function chooseBucketMs(durationMs: number): number {
  const raw = durationMs / TARGET_BUCKETS;

  return Math.max(
    NATIVE_SAMPLE_MS,
    Math.ceil(raw / NATIVE_SAMPLE_MS) * NATIVE_SAMPLE_MS,
  );
}

function fluxTickFormatter(value: number): string {
  return Math.abs(value).toString();
}
