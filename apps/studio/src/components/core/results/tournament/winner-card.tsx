"use client";

import type { TournamentStatsView } from "wowlab-common";

import { TrendingUpIcon, TrophyIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import { StatCard } from "@wowlab/shared/components/common/stat-card";
import { StatCardTrend } from "@wowlab/shared/components/common/stat-card-trend";

type WinnerCardProps = {
  stats: TournamentStatsView;
};

export function WinnerCard({ stats }: Readonly<WinnerCardProps>) {
  const content = useIntlayer("resultsPage");
  const fmtNumber = useNumber();
  const rounded = (value: number) =>
    fmtNumber(value, { maximumFractionDigits: 0 });

  const gainSign = stats.dps_gain >= 0 ? "+" : "";
  const gainLabel =
    stats.dps_gain_pct === undefined
      ? `+${rounded(stats.dps_gain)} ${content.dps.value}`
      : `${gainSign}${stats.dps_gain_pct.toFixed(2)}%`;

  const trend: "up" | "down" = stats.dps_gain >= 0 ? "up" : "down";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<TrophyIcon className="size-4" />}
        value={rounded(stats.winner_dps)}
        title={content.tournamentWinnerDps.value}
        changePercentage={`CI \u00B1${rounded(stats.winner_dps)}`}
        changeLabel={content.dps.value}
      />
      <StatCardTrend
        icon={<TrendingUpIcon />}
        trend={trend}
        changePercentage={gainLabel}
        value={rounded(stats.dps_gain)}
        title={content.tournamentDpsGain.value}
        badgeContent={`${stats.phases_completed} ${content.tournamentPhases.value}`}
      />
      <StatCard
        icon={<TrophyIcon className="size-4" />}
        value={String(stats.total_permutations)}
        title={content.tournamentPermutations.value}
        changePercentage={rounded(stats.baseline_dps)}
        changeLabel={content.tournamentBaselineDps.value}
      />
      <StatCard
        icon={<TrophyIcon className="size-4" />}
        value={rounded(stats.total_iterations)}
        title={content.tournamentTotalIterations.value}
        changePercentage=""
      />
    </div>
  );
}
