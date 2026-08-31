"use client";

import type { ReactNode } from "react";

import { Activity, Hash, Inbox, Radio, Send, Users } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import { BEACON_CHARTS } from "@/lib/metrics";
import { useBeaconStatus } from "@/lib/query/services/metrics";
import { StatCard } from "@wowlab/shared/components/common/stat-card";

import { ErrorState } from "./error-state";
import { MetricsCharts } from "./metrics-charts";

type BeaconStat = {
  changeKey: MetricsContentKey;
  icon: ReactNode;
  titleKey: MetricsContentKey;
  value: (metrics: BeaconStatus, fmtNumber: FmtNumber) => string;
};
type BeaconStatus = NonNullable<ReturnType<typeof useBeaconStatus>["data"]>;
type FmtNumber = ReturnType<typeof useNumber>;

type MetricsContent = ReturnType<typeof useIntlayer<"metricsPage">>;
type MetricsContentKey = Extract<keyof MetricsContent, string>;

const CONNECTION_STATS: BeaconStat[] = [
  {
    changeKey: "connected",
    icon: <Users className="size-4" />,
    titleKey: "clients",
    value: (m) => String(m.connections.clients),
  },
  {
    changeKey: "active",
    icon: <Hash className="size-4" />,
    titleKey: "channels",
    value: (m) => String(m.connections.channels),
  },
  {
    changeKey: "total",
    icon: <Radio className="size-4" />,
    titleKey: "subscriptions",
    value: (m) => String(m.connections.subscriptions),
  },
  {
    changeKey: "unique",
    icon: <Users className="size-4" />,
    titleKey: "users",
    value: (m) => String(m.connections.users),
  },
  {
    changeKey: "inflight",
    icon: <Activity className="size-4" />,
    titleKey: "connecting",
    value: (m) => String(m.connections.inflight),
  },
];

const MESSAGE_STATS: BeaconStat[] = [
  {
    changeKey: "total",
    icon: <Send className="size-4" />,
    titleKey: "messagesSent",
    value: (m, fmtNumber) =>
      fmtNumber(m.messages.sent_total, { maximumFractionDigits: 0 }),
  },
  {
    changeKey: "total",
    icon: <Inbox className="size-4" />,
    titleKey: "messagesReceived",
    value: (m, fmtNumber) =>
      fmtNumber(m.messages.received_total, { maximumFractionDigits: 0 }),
  },
];

export function BeaconTab() {
  const content = useIntlayer("metricsPage");
  const fmtNumber = useNumber();
  const { data: metrics, error } = useBeaconStatus();

  if (error) {
    return <ErrorState message={error.message} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {CONNECTION_STATS.map((stat) => (
          <StatCard
            key={stat.titleKey}
            icon={stat.icon}
            value={stat.value(metrics, fmtNumber)}
            title={content[stat.titleKey].value}
            changePercentage={content[stat.changeKey].value}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MESSAGE_STATS.map((stat) => (
          <StatCard
            key={stat.titleKey}
            icon={stat.icon}
            value={stat.value(metrics, fmtNumber)}
            title={content[stat.titleKey].value}
            changePercentage={content[stat.changeKey].value}
          />
        ))}
      </div>

      <MetricsCharts
        charts={BEACON_CHARTS}
        notConfiguredMetric="centrifugo_node_num_clients"
        queryKey="beacon-range"
      />
    </div>
  );
}
