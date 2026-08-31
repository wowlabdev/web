"use client";

import type { ReactNode } from "react";
import type { ResolvedPaperdoll } from "wowlab-common";

import {
  GaugeIcon,
  HeartIcon,
  ShieldIcon,
  SparklesIcon,
  SwordIcon,
  WandIcon,
  ZapIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import { TableCard } from "@wowlab/shared/components/common/table-card";

type ResolvedStatsProps = {
  resolved: ResolvedPaperdoll;
};

type StatRow = {
  icon: ReactNode;
  key: string;
  label: string;
  value: string;
};

export function ResolvedStats({ resolved }: Readonly<ResolvedStatsProps>) {
  const content = useIntlayer("characterPage");
  const game = useIntlayer("gameComponents");
  const { stats } = resolved;
  const fmtNumber = useNumber();
  const format = (value: number) => fmtNumber(Math.round(value));

  const rows: StatRow[] = [
    {
      icon: <HeartIcon className="size-4" />,
      key: "health",
      label: content.statHealth.value,
      value: format(resolved.max_health),
    },
    {
      icon: <SwordIcon className="size-4" />,
      key: "attack-power",
      label: content.statAttackPower.value,
      value: format(stats.attack_power),
    },
    {
      icon: <WandIcon className="size-4" />,
      key: "spell-power",
      label: content.statSpellPower.value,
      value: format(stats.spell_power),
    },
    {
      icon: <ShieldIcon className="size-4" />,
      key: "primary",
      label: content.statPrimary.value,
      value: format(stats.primary_stat),
    },
    {
      icon: <SparklesIcon className="size-4" />,
      key: "crit",
      label: game.statCriticalStrike.value,
      value: format(stats.crit),
    },
    {
      icon: <ZapIcon className="size-4" />,
      key: "haste",
      label: game.statHaste.value,
      value: format(stats.haste),
    },
    {
      icon: <GaugeIcon className="size-4" />,
      key: "mastery",
      label: game.statMastery.value,
      value: format(stats.mastery),
    },
    {
      icon: <GaugeIcon className="size-4" />,
      key: "versatility",
      label: game.statVersatility.value,
      value: format(stats.versatility),
    },
  ];

  const columns = [
    {
      cell: (row: StatRow) => (
        <div className="flex items-center gap-2.5">
          <span className="text-primary">{row.icon}</span>
          <span className="font-medium">{row.label}</span>
        </div>
      ),
      header: content.resolvedColStat.value,
    },
    {
      cell: (row: StatRow) => <span className="tabular-nums">{row.value}</span>,
      className: "text-right",
      header: content.resolvedColValue.value,
    },
  ];

  return (
    <TableCard
      columns={columns}
      data={rows}
      rowKey={(row) => row.key}
      title={content.statsTitle}
    />
  );
}
