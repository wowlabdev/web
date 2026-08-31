"use client";

import { BriefcaseIcon, LayersIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import { SLOT_ORDER } from "@/lib/sim/slots";
import { StatCard } from "@wowlab/shared/components/common/stat-card";

type InventorySelectionStatsProps = {
  combinationCount: number;
  selectedCount: number;
  totalAvailable: number;
};

export function InventorySelectionStats({
  combinationCount,
  selectedCount,
  totalAvailable,
}: Readonly<InventorySelectionStatsProps>) {
  const content = useIntlayer("simulateShared");
  const fmtNumber = useNumber();

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        icon={<BriefcaseIcon className="size-4" />}
        value={String(selectedCount)}
        title={content.statSelectedItemsTitle.value}
        changePercentage={
          content.statSelectedItemsAvailable({ count: totalAvailable }).value
        }
      />
      <StatCard
        icon={<LayersIcon className="size-4" />}
        value={fmtNumber(combinationCount, { maximumFractionDigits: 0 })}
        title={content.statCombinationsTitle.value}
        changePercentage={
          content.statCombinationsTrend({ count: SLOT_ORDER.length }).value
        }
      />
    </div>
  );
}
