"use client";

import type {
  BeaconMetricName,
  ChartConfig,
  SentinelMetricName,
} from "@/lib/metrics";

import { RangeSelector, useRange } from "@/components/dev";
import { NuqsIsland } from "@/components/shared/islands/nuqs-island";
import { useTimestampFormatter } from "@/hooks/use-timestamp-formatter";
import {
  Skeleton,
  SkeletonCard,
} from "@wowlab/shared/components/common/skeleton-blocks";

import { ChartGrid } from "./chart-grid";
import { MetricsFetchingScope } from "./metrics-fetching-scope";
import { NotConfiguredState } from "./not-configured-state";
import { PollingIndicator } from "./polling-indicator";
import { useNotConfigured } from "./use-not-configured";

type MetricsChartsProps = {
  charts: ChartConfig[];
  notConfiguredMetric: BeaconMetricName | SentinelMetricName;
  queryKey: string;
};

export function MetricsCharts({
  charts,
  notConfiguredMetric,
  queryKey,
}: Readonly<MetricsChartsProps>) {
  return (
    <NuqsIsland fallback={<MetricsChartsSkeleton chartCount={charts.length} />}>
      <MetricsChartsInner
        charts={charts}
        notConfiguredMetric={notConfiguredMetric}
        queryKey={queryKey}
      />
    </NuqsIsland>
  );
}

function MetricsChartsInner({
  charts,
  notConfiguredMetric,
  queryKey,
}: Readonly<MetricsChartsProps>) {
  const [range] = useRange(queryKey);
  const fmt = useTimestampFormatter(range);
  const notConfigured = useNotConfigured(notConfiguredMetric, range);

  if (notConfigured) {
    return <NotConfiguredState service="Grafana" />;
  }

  return (
    <MetricsFetchingScope>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <RangeSelector queryKey={queryKey} />
          <PollingIndicator />
        </div>
        <ChartGrid charts={charts} fmt={fmt} range={range} />
      </div>
    </MetricsFetchingScope>
  );
}

function MetricsChartsSkeleton({
  chartCount,
}: Readonly<{ chartCount: number }>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: chartCount }, (_, index) => (
          <SkeletonCard className="gap-0" headerWidth="w-32" key={index}>
            <Skeleton className="h-52 w-full" />
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}
