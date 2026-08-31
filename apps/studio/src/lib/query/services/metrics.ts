import { useQuery } from "@tanstack/react-query";

import type {
  BeaconMetricName,
  BeaconMetrics,
  PrometheusQueryResponse,
  SentinelMetricName,
  SentinelMetrics,
  TimeRange,
  TimeSeriesPoint,
} from "@/lib/metrics";

import {
  BEACON_METRICS_LIST,
  DEFAULT_BEACON,
  DEFAULT_SENTINEL,
  RANGE_STEPS,
  SENTINEL_METRICS_LIST,
} from "@/lib/metrics";

export const METRICS_BEACON_STATUS_KEY = [
  "metrics",
  "beacon",
  "status",
] as const;

export const METRICS_RANGE_KEY = ["metrics", "range"] as const;

export const METRICS_SENTINEL_STATUS_KEY = [
  "metrics",
  "sentinel",
  "status",
] as const;

type MetricsResult<T> = {
  data: T;
  error: Error | null;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
};

export function useBeaconStatus(): MetricsResult<BeaconMetrics> {
  const query = useQuery({
    queryFn: fetchBeaconMetrics,
    queryKey: METRICS_BEACON_STATUS_KEY,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });

  return {
    data: query.data ?? DEFAULT_BEACON,
    error: query.error,
    isError: query.isError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
  };
}

export function useMetricsRange(
  metric: BeaconMetricName | SentinelMetricName,
  range: TimeRange,
): MetricsResult<TimeSeriesPoint[]> {
  const step = RANGE_STEPS[range];
  const query = useQuery({
    queryFn: () => fetchMetricRange(metric, range),
    queryKey: [...METRICS_RANGE_KEY, metric, range],
    refetchInterval: step * 1000,
    staleTime: step * 1000,
  });

  return {
    data: query.data ?? [],
    error: query.error,
    isError: query.isError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
  };
}

export function useSentinelStatus(): MetricsResult<SentinelMetrics> {
  const query = useQuery({
    queryFn: fetchSentinelMetrics,
    queryKey: METRICS_SENTINEL_STATUS_KEY,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });

  return {
    data: query.data ?? DEFAULT_SENTINEL,
    error: query.error,
    isError: query.isError,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
  };
}

async function fetchBeaconMetrics(): Promise<BeaconMetrics> {
  const res = await fetch(
    `/api/metrics/query?metrics=${BEACON_METRICS_LIST.join(",")}`,
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json: { data: Record<string, number> } = await res.json();
  const d = json.data;

  return {
    connections: {
      channels: d["centrifugo_node_num_channels"] ?? 0,
      clients: d["centrifugo_node_num_clients"] ?? 0,
      inflight: d["centrifugo_client_connections_inflight"] ?? 0,
      subscriptions: d["centrifugo_node_num_subscriptions"] ?? 0,
      users: d["centrifugo_node_num_users"] ?? 0,
    },
    messages: {
      received_total: d["centrifugo_node_messages_received_count"] ?? 0,
      sent_total: d["centrifugo_node_messages_sent_count"] ?? 0,
    },
  };
}

async function fetchMetricRange(
  metric: string,
  range: TimeRange,
): Promise<TimeSeriesPoint[]> {
  const params = new URLSearchParams({
    metric,
    range,
  });
  const res = await fetch(`/api/metrics/query?${params}`);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json: PrometheusQueryResponse = await res.json();

  if (json.status !== "success" || json.data.result.length === 0) {
    return [];
  }

  return json.data.result[0].values.map(([ts, val]) => ({
    x: ts,
    y: Number(val),
  }));
}

async function fetchSentinelMetrics(): Promise<SentinelMetrics> {
  const res = await fetch(
    `/api/metrics/query?metrics=${SENTINEL_METRICS_LIST.join(",")}`,
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json: { data: Record<string, number> } = await res.json();
  const d = json.data;

  return {
    counters: {
      chunks_assigned_total: d["sentinel_chunks_assigned_total"] ?? 0,
      chunks_reclaimed_total: d["sentinel_chunks_reclaimed_total"] ?? 0,
      nodes_marked_offline_total: d["sentinel_nodes_marked_offline_total"] ?? 0,
      stale_data_cleanups_total: d["sentinel_stale_data_cleanups_total"] ?? 0,
    },
    gauges: {
      chunks_pending: d["sentinel_chunks_pending"] ?? 0,
      chunks_running: d["sentinel_chunks_running"] ?? 0,
      nodes_online: d["sentinel_nodes_online"] ?? 0,
      uptime_seconds: d["sentinel_uptime_seconds"] ?? 0,
    },
  };
}
