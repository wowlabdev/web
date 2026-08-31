"use client";

import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import { useMemo } from "react";

import { AreaChart, type ChartSeries } from "@/components/shared/ui/charts";
import {
  Card,
  CardContent,
  CardHeader,
} from "@wowlab/shared/components/ui/card";
import { cn } from "@wowlab/shared/lib/utils";

type ChartMetricsAreaProps = {
  className?: string;
  data: ChartRow[];
  error?: string | null;
  isLoading?: boolean;
  series: { color: string; key: string; label: string }[];
  title: string;
};

type ChartRow = { time: string; [key: string]: number | string };

export function ChartMetricsArea({
  className,
  data,
  error,
  isLoading,
  series,
  title,
}: Readonly<ChartMetricsAreaProps>) {
  const content = useIntlayer("metricsPage");
  const fmtNumber = useNumber();
  const chartSeries: ChartSeries<ChartRow>[] = series.map((item) => ({
    color: item.color,
    dataKey: item.key,
    label: item.label,
  }));
  const yAxisConfig = useMemo(
    () => ({
      tickFormatter: (value: number) =>
        fmtNumber(value, { notation: "compact" }),
      width: 48,
    }),
    [fmtNumber],
  );

  const renderChartBody = () => {
    if (isLoading) {
      return (
        <div className="flex h-52 items-center justify-center">
          <span className="text-muted-foreground text-sm">
            {content.loading}
          </span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-52 items-center justify-center">
          <span className="text-destructive text-sm">{error}</span>
        </div>
      );
    }

    if (data.length < 2) {
      return (
        <div className="flex h-52 items-center justify-center">
          <span className="text-muted-foreground text-sm">
            {content.notEnoughData}
          </span>
        </div>
      );
    }

    return (
      <AreaChart
        analytics={{ enabled: false }}
        data={data}
        height={208}
        series={chartSeries}
        xAxis={{ dataKey: "time" }}
        yAxis={yAxisConfig}
      />
    );
  };

  return (
    <Card className={cn("gap-0", className)}>
      <CardHeader className="pb-2">
        <span className="text-sm font-semibold">{title}</span>
      </CardHeader>
      <CardContent>{renderChartBody()}</CardContent>
    </Card>
  );
}
