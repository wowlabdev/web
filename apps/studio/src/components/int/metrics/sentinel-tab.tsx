"use client";

import type { ReactNode } from "react";

import { Clock, Hash, Layers, Server, Zap } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import { SENTINEL_CHARTS } from "@/lib/metrics";
import { useSentinelStatus } from "@/lib/query/services/metrics";
import { StatCard } from "@wowlab/shared/components/common/stat-card";

import { ErrorState } from "./error-state";
import { MetricsCharts } from "./metrics-charts";

type FmtNumber = ReturnType<typeof useNumber>;
type MetricsContent = ReturnType<typeof useIntlayer<"metricsPage">>;
type MetricsContentKey = Extract<keyof MetricsContent, string>;
type SentinelStat = {
  changeKey: MetricsContentKey;
  icon: ReactNode;
  titleKey: MetricsContentKey;
  value: (metrics: SentinelStatus, fmtNumber: FmtNumber) => string;
};

type SentinelStatus = NonNullable<ReturnType<typeof useSentinelStatus>["data"]>;

const GAUGE_STATS: SentinelStat[] = [
  {
    changeKey: "active",
    icon: <Server className="size-4" />,
    titleKey: "nodesOnline",
    value: (m) => String(m.gauges.nodes_online),
  },
  {
    changeKey: "hours",
    icon: <Clock className="size-4" />,
    titleKey: "uptime",
    value: (m, fmtNumber) =>
      fmtNumber(m.gauges.uptime_seconds / 3600, {
        maximumFractionDigits: 1,
        style: "unit",
        unit: "hour",
        unitDisplay: "narrow",
      }),
  },
  {
    changeKey: "chunks",
    icon: <Layers className="size-4" />,
    titleKey: "pending",
    value: (m) => String(m.gauges.chunks_pending),
  },
  {
    changeKey: "chunks",
    icon: <Zap className="size-4" />,
    titleKey: "running",
    value: (m) => String(m.gauges.chunks_running),
  },
];

const COUNTER_STATS: SentinelStat[] = [
  {
    changeKey: "total",
    icon: <Hash className="size-4" />,
    titleKey: "chunksAssigned",
    value: (m, fmtNumber) =>
      fmtNumber(m.counters.chunks_assigned_total, { maximumFractionDigits: 0 }),
  },
  {
    changeKey: "total",
    icon: <Hash className="size-4" />,
    titleKey: "chunksReclaimed",
    value: (m, fmtNumber) =>
      fmtNumber(m.counters.chunks_reclaimed_total, {
        maximumFractionDigits: 0,
      }),
  },
  {
    changeKey: "total",
    icon: <Hash className="size-4" />,
    titleKey: "nodesOffline",
    value: (m, fmtNumber) =>
      fmtNumber(m.counters.nodes_marked_offline_total, {
        maximumFractionDigits: 0,
      }),
  },
  {
    changeKey: "total",
    icon: <Hash className="size-4" />,
    titleKey: "staleCleanups",
    value: (m, fmtNumber) =>
      fmtNumber(m.counters.stale_data_cleanups_total, {
        maximumFractionDigits: 0,
      }),
  },
];

export function SentinelTab() {
  const content = useIntlayer("metricsPage");
  const fmtNumber = useNumber();
  const { data: metrics, error } = useSentinelStatus();

  if (error) {
    return <ErrorState message={error.message} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {GAUGE_STATS.map((stat) => (
          <StatCard
            key={stat.titleKey}
            icon={stat.icon}
            value={stat.value(metrics, fmtNumber)}
            title={content[stat.titleKey].value}
            changePercentage={content[stat.changeKey].value}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {COUNTER_STATS.map((stat) => (
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
        charts={SENTINEL_CHARTS}
        notConfiguredMetric="sentinel_nodes_online"
        queryKey="sentinel-range"
      />
    </div>
  );
}
