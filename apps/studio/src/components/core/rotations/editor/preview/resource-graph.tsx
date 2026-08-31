"use client";

import type { IterationTrace, ResourceSample } from "wowlab-engine";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import {
  AreaChart,
  type ChartSeries,
  useChartTimeFormatters,
} from "@/components/shared/ui/charts";
import { useIsMobile } from "@wowlab/shared/hooks/use-is-mobile";

import { stringHashToHsl } from "./palette";

type ChartPoint = {
  primary?: number;
  secondary?: number;
  timeMs: number;
};

type ResourceGraphProps = {
  trace: IterationTrace | null;
};

export function ResourceGraph({ trace }: Readonly<ResourceGraphProps>) {
  const content = useIntlayer("rotationEditor");
  const { labelFormatter, tickFormatter } = useChartTimeFormatters();
  const isMobile = useIsMobile();
  const { data, primaryName, secondaryName } = useMemo(
    () => bucketSamples(trace?.resourceSamples ?? []),
    [trace?.resourceSamples],
  );

  const series = useMemo<ChartSeries<ChartPoint>[]>(() => {
    const out: ChartSeries<ChartPoint>[] = [];

    if (primaryName) {
      out.push({
        color: stringHashToHsl(primaryName),
        dataKey: "primary",
        label: primaryName,
      });
    }

    if (secondaryName) {
      out.push({
        color: stringHashToHsl(secondaryName, 65, 55),
        dataKey: "secondary",
        label: secondaryName,
      });
    }

    return out;
  }, [primaryName, secondaryName]);

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
    <AreaChart
      analytics={{ baseSeries: "primary", defaultKeys: [] }}
      data={data}
      height={isMobile ? 140 : 180}
      series={series}
      xAxis={{ dataKey: "timeMs", labelFormatter, tickFormatter }}
    />
  );
}

function bucketSamples(samples: ResourceSample[]): {
  data: ChartPoint[];
  primaryName: null | string;
  secondaryName: null | string;
} {
  if (samples.length === 0) {
    return { data: [], primaryName: null, secondaryName: null };
  }

  const namesInOrder: string[] = [];

  for (const sample of samples) {
    if (!namesInOrder.includes(sample.resourceName)) {
      namesInOrder.push(sample.resourceName);
    }
  }

  const primaryName = namesInOrder[0] ?? null;
  const secondaryName = namesInOrder[1] ?? null;

  const byTime = new Map<number, ChartPoint>();

  for (const sample of samples) {
    const point = byTime.get(sample.timeMs) ?? { timeMs: sample.timeMs };

    if (sample.resourceName === primaryName) {
      point.primary = sample.current;
    } else if (sample.resourceName === secondaryName) {
      point.secondary = sample.current;
    }

    byTime.set(sample.timeMs, point);
  }

  const data = [...byTime.values()].sort((a, b) => a.timeMs - b.timeMs);

  return { data, primaryName, secondaryName };
}
