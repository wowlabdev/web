"use client";

import type {
  BeaconMetricName,
  SentinelMetricName,
  TimeRange,
} from "@/lib/metrics";

import { useMetricsRange } from "@/lib/query/services/metrics";

export function useNotConfigured(
  metric: BeaconMetricName | SentinelMetricName,
  range: TimeRange,
) {
  const { error } = useMetricsRange(metric, range);

  return (
    error?.message.includes("503") || error?.message.includes("not configured")
  );
}
