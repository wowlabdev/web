import ms, { type StringValue } from "ms";

import type { TimeRange } from "./types";

const TARGET_POINTS = 120;

export const RANGES: TimeRange[] = [
  "5m",
  "15m",
  "1h",
  "6h",
  "24h",
  "7d",
  "30d",
];

export function isTimeRange(value: string): value is TimeRange {
  return RANGES.includes(value as TimeRange);
}

function toSeconds(range: StringValue): number {
  return ms(range) / 1000;
}

export const RANGE_SECONDS: Record<string, number> = Object.fromEntries(
  RANGES.map((r) => [r, toSeconds(r)]),
);

export const RANGE_STEPS: Record<TimeRange, number> = Object.fromEntries(
  RANGES.map((r) => [r, Math.max(1, Math.round(toSeconds(r) / TARGET_POINTS))]),
) as Record<TimeRange, number>;

export const BEACON_METRICS_LIST = [
  "centrifugo_node_num_clients",
  "centrifugo_node_num_channels",
  "centrifugo_node_num_subscriptions",
  "centrifugo_node_num_users",
  "centrifugo_client_connections_inflight",
  "centrifugo_node_messages_sent_count",
  "centrifugo_node_messages_received_count",
  "centrifugo_transport_messages_sent",
  "centrifugo_transport_messages_received",
  "centrifugo_transport_messages_sent_size",
  "centrifugo_transport_messages_received_size",
] as const;

export const SENTINEL_METRICS_LIST = [
  "sentinel_chunks_assigned_total",
  "sentinel_chunks_reclaimed_total",
  "sentinel_nodes_marked_offline_total",
  "sentinel_stale_data_cleanups_total",
  "sentinel_chunks_pending",
  "sentinel_chunks_running",
  "sentinel_nodes_online",
  "sentinel_uptime_seconds",
] as const;

export const DEFAULT_BEACON = {
  connections: {
    channels: 0,
    clients: 0,
    inflight: 0,
    subscriptions: 0,
    users: 0,
  },
  messages: { received_total: 0, sent_total: 0 },
} as const;

export const DEFAULT_SENTINEL = {
  counters: {
    chunks_assigned_total: 0,
    chunks_reclaimed_total: 0,
    nodes_marked_offline_total: 0,
    stale_data_cleanups_total: 0,
  },
  gauges: {
    chunks_pending: 0,
    chunks_running: 0,
    nodes_online: 0,
    uptime_seconds: 0,
  },
} as const;

export const ALLOWED_METRICS: Set<string> = new Set([
  ...BEACON_METRICS_LIST,
  ...SENTINEL_METRICS_LIST,
]);
