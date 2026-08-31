"use client";

import {
  FlaskConicalIcon,
  LayersIcon,
  TrophyIcon,
  ZapIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import { TOTAL_CHUNKS } from "@/lib/sim/mock-bags-config";
import { StatCard } from "@wowlab/shared/components/common/stat-card";

import type { SimPhase } from "./source-badge";

type InventorySimStatsProps = {
  bestPermDps: number;
  chunk: number;
  permsSimmed: number;
  phase: SimPhase;
  simsPerSec: number;
  slotCount: number;
  totalPerms: number;
};

export function InventorySimStats({
  bestPermDps,
  chunk,
  permsSimmed,
  phase,
  simsPerSec,
  slotCount,
  totalPerms,
}: Readonly<InventorySimStatsProps>) {
  const content = useIntlayer("simulateMockBags");
  const fmtNumber = useNumber();

  const stats = [
    {
      changePercentage: content.statPermutationsTrend({ count: slotCount })
        .value,
      icon: <LayersIcon className="size-4" />,
      key: "permutations",
      title: content.statPermutationsTitle.value,
      value: fmtNumber(totalPerms),
    },
    {
      changePercentage: content.statSimmedTrend({ chunk, total: TOTAL_CHUNKS })
        .value,
      icon: <FlaskConicalIcon className="size-4" />,
      key: "simmed",
      title: content.statSimmedTitle.value,
      value: fmtNumber(permsSimmed),
    },
    {
      changePercentage:
        phase === "running"
          ? content.statSimsPerSecActive.value
          : content.statSimsPerSecDone.value,
      icon: <ZapIcon className="size-4" />,
      key: "simsPerSec",
      title: content.statSimsPerSecTitle.value,
      value: fmtNumber(simsPerSec),
    },
    {
      changePercentage:
        phase === "complete"
          ? content.statBestDpsFinal.value
          : content.statBestDpsConverging.value,
      icon: <TrophyIcon className="size-4" />,
      key: "bestDps",
      title: content.statBestDpsTitle.value,
      value: fmtNumber(bestPermDps),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.key}
          changePercentage={stat.changePercentage}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
        />
      ))}
    </div>
  );
}
