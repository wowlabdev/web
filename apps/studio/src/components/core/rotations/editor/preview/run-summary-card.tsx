"use client";

import type { IterationTrace } from "wowlab-engine";

import { ActivityIcon, GaugeIcon, ZapIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import { StatGrid } from "@/components/shared/layout";
import { StatCard } from "@wowlab/shared/components/common/stat-card";

type RunSummaryCardProps = {
  trace: IterationTrace | null;
};

export function RunSummaryCard({ trace }: Readonly<RunSummaryCardProps>) {
  const content = useIntlayer("rotationEditor");
  const fmtNumber = useNumber();

  const placeholder = content.summaryPlaceholderValue.value;

  const stats = [
    {
      icon: <ZapIcon className="size-4" />,
      key: "dps",
      title: content.previewSummaryDps.value,
      value: trace
        ? fmtNumber(Math.round(trace.estimatedDps), { notation: "compact" })
        : placeholder,
    },
    {
      icon: <ActivityIcon className="size-4" />,
      key: "casts",
      title: content.previewSummaryCasts.value,
      value: trace ? String(trace.totalCasts) : placeholder,
    },
    {
      icon: <GaugeIcon className="size-4" />,
      key: "gcd",
      title: content.previewSummaryGcd.value,
      value: trace ? `${trace.gcdUtilizationPct.toFixed(1)}%` : placeholder,
    },
  ];

  return (
    <StatGrid>
      {stats.map((stat) => (
        <StatCard
          key={stat.key}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          changePercentage=""
        />
      ))}
    </StatGrid>
  );
}
