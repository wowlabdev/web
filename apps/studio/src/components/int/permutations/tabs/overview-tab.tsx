"use client";

import type { ReactNode } from "react";
import type { CostAnalysis, PermutationSpace } from "wowlab-common";

import { LayersIcon, PackageIcon, SigmaIcon, ZapIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import { StatCard } from "@wowlab/shared/components/common/stat-card";

import type { FormatNumber, Profile } from "../shared";

import { createFormatters } from "../shared";

export type OverviewTabProps = {
  costs: CostAnalysis;
  fmtNumber: FormatNumber;
  markdown: string;
  profile: Profile;
  space: PermutationSpace;
  specName: string | null;
};
type OverviewStat = {
  change: string;
  changeLabel?: string;
  icon: ReactNode;
  key: string;
  title: string;
  value: string;
};

export function OverviewTab({
  costs,
  fmtNumber,
  markdown,
  profile,
  space,
  specName,
}: Readonly<OverviewTabProps>) {
  const content = useIntlayer("permutationsPage");
  const character = profile.character;
  const { compact, integer } = createFormatters(fmtNumber);
  const uncontestedSlots = space.slots.length - space.contestedCount;
  const stats: OverviewStat[] = [
    {
      change: content.overviewTab.contestedRatio({
        contested: space.contestedCount,
        count: space.slots.length,
        total: space.slots.length,
      }).value,
      changeLabel: content.overviewTab.contestedLabel.value,
      icon: <SigmaIcon className="size-4" />,
      key: "permutations",
      title: content.overviewTab.permutationsTitle.value,
      value: integer(space.total),
    },
    {
      change: content.overviewTab.contestedSlotsChange(uncontestedSlots).value,
      icon: <LayersIcon className="size-4" />,
      key: "contestedSlots",
      title: content.overviewTab.contestedSlotsTitle.value,
      value: String(space.contestedCount),
    },
    {
      change: content.overviewTab.candidatesChange({
        bag: profile.bagItems.length,
        weekly: profile.weeklyRewards.length,
      }).value,
      icon: <PackageIcon className="size-4" />,
      key: "candidates",
      title: content.overviewTab.candidatesTitle.value,
      value: String(space.totalCandidates),
    },
    {
      change: content.overviewTab.bruteForceChange.value,
      icon: <ZapIcon className="size-4" />,
      key: "bruteForce",
      title: content.overviewTab.bruteForceTitle.value,
      value: compact(costs.bruteForce),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          {character.name} ·{specName ?? character.class} ·{" "}
          {content.overviewTab.level({ level: character.level })}
          {character.region && character.server
            ? ` · ${character.region}/${character.server}`
            : null}
        </span>
        <CopyButton value={markdown} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            changePercentage={stat.change}
            changeLabel={stat.changeLabel}
          />
        ))}
      </div>
    </div>
  );
}
