import ms from "ms";

import type { BeaconMetricName, SentinelMetricName } from "./types";

export const ONE_DAY_MS = ms("1d");

export const SEVEN_DAYS_MS = ms("7d");

export type ChartConfig = SingleChartConfig | MergedChartConfig;

export type MergedChartConfig = {
  type: "merged";
  metrics: [
    { metric: BeaconMetricName | SentinelMetricName; key: string },
    { metric: BeaconMetricName | SentinelMetricName; key: string },
  ];
  title: string;
  series: { key: string; label: string; color: string }[];
};

export type SingleChartConfig = {
  type: "single";
  metric: BeaconMetricName | SentinelMetricName;
  title: string;
  series: { key: string; label: string; color: string };
};

export const BEACON_CHARTS: ChartConfig[] = [
  {
    metric: "centrifugo_node_num_clients",
    series: { color: "var(--chart-1)", key: "value", label: "Clients" },
    title: "Connected Clients",
    type: "single",
  },
  {
    metric: "centrifugo_node_num_users",
    series: { color: "var(--chart-2)", key: "value", label: "Users" },
    title: "Unique Users",
    type: "single",
  },
  {
    metric: "centrifugo_node_num_channels",
    series: { color: "var(--chart-3)", key: "value", label: "Channels" },
    title: "Channels",
    type: "single",
  },
  {
    metric: "centrifugo_node_num_subscriptions",
    series: { color: "var(--chart-4)", key: "value", label: "Subscriptions" },
    title: "Subscriptions",
    type: "single",
  },
  {
    metrics: [
      { key: "sent", metric: "centrifugo_node_messages_sent_count" },
      { key: "received", metric: "centrifugo_node_messages_received_count" },
    ],
    series: [
      { color: "var(--chart-1)", key: "sent", label: "Sent" },
      { color: "var(--chart-2)", key: "received", label: "Received" },
    ],
    title: "Broker Messages",
    type: "merged",
  },
  {
    metrics: [
      { key: "sent", metric: "centrifugo_transport_messages_sent" },
      { key: "received", metric: "centrifugo_transport_messages_received" },
    ],
    series: [
      { color: "var(--chart-3)", key: "sent", label: "Sent" },
      { color: "var(--chart-4)", key: "received", label: "Received" },
    ],
    title: "Transport Messages",
    type: "merged",
  },
  {
    metrics: [
      { key: "sent", metric: "centrifugo_transport_messages_sent_size" },
      {
        key: "received",
        metric: "centrifugo_transport_messages_received_size",
      },
    ],
    series: [
      { color: "var(--chart-5)", key: "sent", label: "Sent" },
      { color: "var(--chart-1)", key: "received", label: "Received" },
    ],
    title: "Bandwidth (Bytes)",
    type: "merged",
  },
];

export const SENTINEL_CHARTS: ChartConfig[] = [
  {
    metric: "sentinel_nodes_online",
    series: { color: "var(--chart-1)", key: "value", label: "Nodes" },
    title: "Nodes Online",
    type: "single",
  },
  {
    metrics: [
      { key: "running", metric: "sentinel_chunks_running" },
      { key: "pending", metric: "sentinel_chunks_pending" },
    ],
    series: [
      { color: "var(--chart-2)", key: "running", label: "Running" },
      { color: "var(--chart-4)", key: "pending", label: "Pending" },
    ],
    title: "Chunks",
    type: "merged",
  },
];
