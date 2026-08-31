"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import { useItems, useItemScaling } from "@/lib/game-data";
import { useCommonModule } from "@/lib/query/services/game";
import {
  Card,
  CardContent,
  CardHeader,
} from "@wowlab/shared/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
} from "@wowlab/shared/components/ui/empty";
import { stableId } from "@wowlab/shared/lib/id";

import type {
  DifficultyScope,
  JournalEncounter,
  JournalSource,
  LootRow,
} from "./types";

import { LootGridHeader } from "./loot-grid-header";
import { LootGridRow } from "./loot-grid-row";
import { LootGridRowSkeleton } from "./loot-grid-row-skeleton";
import { useResolvedLoot } from "./use-resolved-loot";

type LootGridProps = {
  filteredCount: number;
  isLoading: boolean;
  loot: LootRow[];
  media: {
    encounterImageUrl: null | string;
    instanceBackgroundUrl: null | string;
  };
  onSearchChange: (value: string) => void;
  scope: DifficultyScope;
  search: string;
  selectedEncounter: JournalEncounter;
  selectedSource: JournalSource;
  totalCount: number;
};

const getSkeletonCount = (known: number) => Math.min(Math.max(known, 6), 20);

export function LootGrid({
  filteredCount,
  isLoading,
  loot,
  media,
  onSearchChange,
  scope,
  search,
  selectedEncounter,
  selectedSource,
  totalCount,
}: Readonly<LootGridProps>) {
  const content = useIntlayer("journalPage");
  const itemIds = useMemo(
    () => [...new Set(loot.map((row) => row.itemId))],
    [loot],
  );
  const bonusIds = useMemo(
    () =>
      loot.flatMap((row) =>
        row.bonusVariants.flatMap((variant) => variant.bonusIds),
      ),
    [loot],
  );
  const { data: items, isLoading: itemsLoading } = useItems(itemIds);
  const { data: common, isLoading: commonLoading } = useCommonModule();
  const { data: effectiveScalingData } = useItemScaling(bonusIds);
  const isFetching =
    isLoading || itemsLoading || commonLoading || !effectiveScalingData;
  const { rows: resolvedLoot, status } = useResolvedLoot({
    common,
    isFetching,
    items,
    loot,
    scalingData: effectiveScalingData,
  });
  const skeletonCount = getSkeletonCount(
    loot.length || filteredCount || totalCount,
  );

  const renderLootBody = () => {
    if (status === "loading") {
      return (
        <div className="divide-y divide-border border">
          {Array.from({ length: skeletonCount }, (_, index) => (
            <LootGridRowSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (status === "ready") {
      return (
        <div className="divide-y divide-border border">
          {resolvedLoot.map(({ item, resolved, row }) => (
            <LootGridRow
              key={stableId("journal-loot", [
                row.sourceId,
                row.encounterId,
                row.itemId,
                row.bonusIds.join("."),
              ])}
              common={common}
              initialResolved={resolved}
              item={item}
              row={row}
              scalingData={effectiveScalingData}
            />
          ))}
        </div>
      );
    }

    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{content.noLoot}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  };

  return (
    <Card size="sm" className="overflow-hidden shadow-none">
      <CardHeader className="border-b px-3 pb-3 pt-3">
        <LootGridHeader
          filteredCount={filteredCount}
          media={media}
          onSearchChange={onSearchChange}
          scope={scope}
          search={search}
          selectedEncounter={selectedEncounter}
          selectedSource={selectedSource}
          totalCount={totalCount}
        />
      </CardHeader>
      <CardContent>{renderLootBody()}</CardContent>
    </Card>
  );
}
