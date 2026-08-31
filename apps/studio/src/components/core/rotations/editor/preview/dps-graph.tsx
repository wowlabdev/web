"use client";

import type { DpsSample, IterationTrace } from "wowlab-engine";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import {
  type ChartSeries,
  LineChart,
  useChartTimeFormatters,
} from "@/components/shared/ui/charts";
import { useIsMobile } from "@wowlab/shared/hooks/use-is-mobile";

type DpsGraphProps = {
  trace: IterationTrace | null;
};

export function DpsGraph({ trace }: Readonly<DpsGraphProps>) {
  const content = useIntlayer("rotationEditor");
  const { labelFormatter, tickFormatter } = useChartTimeFormatters();
  const isMobile = useIsMobile();

  const series = useMemo<ChartSeries<DpsSample>[]>(
    () => [
      {
        color: "var(--chart-1)",
        dataKey: "dps",
        label: content.previewDpsSeriesLabel.value,
      },
    ],
    [content.previewDpsSeriesLabel],
  );

  if (!trace) {
    return null;
  }

  const data = trace.dpsSamples;

  if (data.length < 2) {
    return (
      <p className="text-sm text-muted-foreground">{content.previewDpsEmpty}</p>
    );
  }

  return (
    <LineChart
      analytics={{ enabled: false }}
      data={data}
      height={isMobile ? 140 : 180}
      series={series}
      xAxis={{ dataKey: "timeMs", labelFormatter, tickFormatter }}
    />
  );
}
