"use client";

import type { ResolvedItem } from "wowlab-common";

import { useIntlayer } from "next-intlayer";
import { useMemo, useState } from "react";

import type { Item } from "@wowlab/shared/lib/supabase/types";

import {
  GameIcon,
  GameTooltip,
  GameTooltipWrapper,
} from "@/components/shared/game";
import { INVENTORY_TYPE_LABELS } from "@/lib/game/item-labels";
import { resolveItemLevelTrack } from "@/lib/game/item-track";
import { QUALITY_CLASSES, QUALITY_LABELS } from "@/lib/game/quality";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { cn } from "@wowlab/shared/lib/utils";

import type { LootGridRowProps } from "./loot-grid.types";
import type { LootRow } from "./types";

import { LOOT_ROW_GRID } from "./loot-grid-layout";
import { buildResolvedItem } from "./loot-grid-scaling";
import { LootStatList } from "./loot-stat-list";
import { LootVariantSelector } from "./loot-variant-selector";

type LootIdentityProps = {
  item: Item;
  resolved: ResolvedItem;
  row: LootRow;
};

export function LootGridRow({
  common,
  initialResolved,
  item,
  row,
  scalingData,
}: Readonly<LootGridRowProps>) {
  const [enabledBonusIds, setEnabledBonusIds] = useState(row.bonusIds);
  const resolved = useMemo(
    () =>
      common && scalingData
        ? buildResolvedItem({ common, enabledBonusIds, item, scalingData })
        : initialResolved,
    [common, enabledBonusIds, initialResolved, item, scalingData],
  );

  return (
    <div className={cn(LOOT_ROW_GRID, "hover:bg-muted/20")}>
      <LootIdentity item={item} resolved={resolved} row={row} />
      <LootVariantSelector
        enabledBonusIds={enabledBonusIds}
        resolved={resolved}
        row={row}
        onChange={setEnabledBonusIds}
      />
      <LootStatList itemId={row.itemId} stats={resolved.stats} />
    </div>
  );
}

function LootIdentity({ item, resolved, row }: Readonly<LootIdentityProps>) {
  const content = useIntlayer("journalPage");
  const slotLabel =
    resolved.classification?.inventory_type_name ??
    INVENTORY_TYPE_LABELS[item.inventory_type];
  const itemType = resolved.classification?.subclass_name ?? row.type;

  return (
    <div className="min-w-0">
      <GameTooltipWrapper
        tooltip={
          <GameTooltip bonusIds={row.bonusIds} id={row.itemId} kind="item" />
        }
      >
        <div className="group flex min-w-0 items-start gap-3">
          {item.file_name ? (
            <GameIcon
              alt={item.name}
              className="size-16 rounded-md border border-border/80 shadow-sm"
              iconName={item.file_name}
              size="lg"
            />
          ) : (
            <Skeleton className="size-16 rounded-md" />
          )}
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex min-w-0 items-baseline gap-2">
              <span
                className={cn(
                  "truncate text-base font-semibold leading-tight group-hover:underline",
                  QUALITY_CLASSES[resolved.quality],
                )}
              >
                {item.name}
              </span>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                #{row.itemId}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span>
                {QUALITY_LABELS[resolved.quality] ??
                  content.qualityFallback({ quality: resolved.quality })}
              </span>
              <span className="text-border">/</span>
              <span>{slotLabel}</span>
              <span className="text-border">/</span>
              <span>{itemType}</span>
              <span className="text-border">/</span>
              <span>{resolveItemLevelTrack(resolved.item_level)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="text-muted-foreground">
                {content.baseItemLevel({ level: item.item_level })}
              </span>
              <span className="font-medium text-foreground">
                {content.scaledItemLevel({ level: resolved.item_level })}
              </span>
            </div>
          </div>
        </div>
      </GameTooltipWrapper>
    </div>
  );
}
