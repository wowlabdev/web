"use client";

import type {
  ChartConfig,
  MergedChartConfig,
  SingleChartConfig,
  TimeRange,
  TimestampFormatter,
} from "@/lib/metrics";

import { ChartMetricsArea } from "@/components/int/metrics/chart-metrics-area";
import { mergeChartData, toChartData } from "@/lib/metrics";
import { useMetricsRange } from "@/lib/query/services/metrics";

import { useFetchingReport } from "./use-fetching-report";

type ChartGridProps = {
  charts: ChartConfig[];
  fmt: TimestampFormatter;
  range: TimeRange;
};

type MergedMetricsChartProps = {
  config: MergedChartConfig;
  fmt: TimestampFormatter;
  range: TimeRange;
};

type SingleMetricsChartProps = {
  config: SingleChartConfig;
  fmt: TimestampFormatter;
  range: TimeRange;
};

export function ChartGrid({ charts, fmt, range }: Readonly<ChartGridProps>) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {charts.map((config) =>
        config.type === "single" ? (
          <SingleMetricsChart
            key={config.metric}
            config={config}
            fmt={fmt}
            range={range}
          />
        ) : (
          <MergedMetricsChart
            key={config.title}
            config={config}
            fmt={fmt}
            range={range}
          />
        ),
      )}
    </div>
  );
}

function MergedMetricsChart({
  config,
  fmt,
  range,
}: Readonly<MergedMetricsChartProps>) {
  const first = useMetricsRange(config.metrics[0].metric, range);
  const second = useMetricsRange(config.metrics[1].metric, range);

  useFetchingReport(config.metrics[0].metric, first.isFetching);
  useFetchingReport(config.metrics[1].metric, second.isFetching);

  const chartData = mergeChartData(
    [
      { key: config.metrics[0].key, points: first.data },
      { key: config.metrics[1].key, points: second.data },
    ],
    fmt,
  );

  return (
    <ChartMetricsArea
      title={config.title}
      data={chartData}
      series={config.series}
      isLoading={first.isLoading || second.isLoading}
    />
  );
}

function SingleMetricsChart({
  config,
  fmt,
  range,
}: Readonly<SingleMetricsChartProps>) {
  const { data, error, isFetching, isLoading } = useMetricsRange(
    config.metric,
    range,
  );

  useFetchingReport(config.metric, isFetching);

  return (
    <ChartMetricsArea
      title={config.title}
      data={toChartData(data, fmt, config.series.key)}
      series={[config.series]}
      isLoading={isLoading}
      error={error?.message}
    />
  );
}
