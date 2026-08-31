export type BeaconMetricName =
  | "centrifugo_node_num_clients"
  | "centrifugo_node_num_channels"
  | "centrifugo_node_num_subscriptions"
  | "centrifugo_node_num_users"
  | "centrifugo_node_messages_sent_count"
  | "centrifugo_node_messages_received_count"
  | "centrifugo_transport_messages_sent"
  | "centrifugo_transport_messages_received"
  | "centrifugo_transport_messages_sent_size"
  | "centrifugo_transport_messages_received_size";

export type BeaconMetrics = {
  connections: {
    clients: number;
    channels: number;
    subscriptions: number;
    users: number;
    inflight: number;
  };
  messages: {
    sent_total: number;
    received_total: number;
  };
};

export type MetricSeries = {
  key: string;
  points: TimeSeriesPoint[];
};

export type PrometheusQueryResponse = {
  data: {
    result: { metric: Record<string, string>; values: [number, string][] }[];
    resultType: "matrix" | "vector";
  };
  status: "success" | "error";
};

export type SentinelMetricName =
  | "sentinel_nodes_online"
  | "sentinel_chunks_running"
  | "sentinel_chunks_pending";

export type SentinelMetrics = {
  counters: {
    chunks_assigned_total: number;
    chunks_reclaimed_total: number;
    nodes_marked_offline_total: number;
    stale_data_cleanups_total: number;
  };
  gauges: {
    chunks_pending: number;
    chunks_running: number;
    nodes_online: number;
    uptime_seconds: number;
  };
};

export type TimeRange = "5m" | "15m" | "1h" | "6h" | "24h" | "7d" | "30d";

export type TimeSeriesPoint = { x: number; y: number };
