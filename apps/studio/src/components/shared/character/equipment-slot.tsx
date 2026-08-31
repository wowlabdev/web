"use client";

import type { GearSlot } from "wowlab-common";

import { useIntlayer } from "next-intlayer";

import { useSlotLabels } from "@/components/core/simulate/use-slot-labels";
import {
  GameIcon,
  GameTooltip,
  GameTooltipWrapper,
} from "@/components/shared/game";
import { useItemSummary } from "@/lib/game-data";
import { QUALITY_CLASSES } from "@/lib/game/quality";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { cn } from "@wowlab/shared/lib/utils";

type EquipmentSlotProps = {
  align?: "left" | "right";
  itemId: number | null;
  slot: GearSlot;
};

export function EquipmentSlot({
  align = "left",
  itemId,
  slot,
}: Readonly<EquipmentSlotProps>) {
  if (itemId) {
    return <EquipmentSlotWithItem align={align} itemId={itemId} slot={slot} />;
  }

  return <EquipmentSlotEmpty align={align} slot={slot} />;
}

function EquipmentSlotEmpty({
  align = "left",
  slot,
}: Readonly<{
  align?: "left" | "right";
  slot: GearSlot;
}>) {
  const shared = useIntlayer("simulateShared");
  const slotLabels = useSlotLabels();
  const isRight = align === "right";
  const slotLabel = slotLabels[slot];

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 p-1.5 transition-colors hover:border-border/80",
        isRight && "sm:flex-row-reverse",
      )}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-xs text-muted-foreground">
        —
      </div>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-0.5",
          isRight && "sm:items-end",
        )}
      >
        <span className="text-sm italic text-muted-foreground">
          {shared.empty}
        </span>
        <span className="text-xs text-muted-foreground/60">{slotLabel}</span>
      </div>
    </div>
  );
}

function EquipmentSlotSkeleton({ isRight }: Readonly<{ isRight: boolean }>) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 p-1.5",
        isRight && "sm:flex-row-reverse",
      )}
    >
      <Skeleton className="size-9 shrink-0 rounded-sm" />
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-0.5",
          isRight && "sm:items-end",
        )}
      >
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3 w-14" />
      </div>
    </div>
  );
}

function EquipmentSlotWithItem({
  align = "left",
  itemId,
  slot,
}: Readonly<{
  align?: "left" | "right";
  itemId: number;
  slot: GearSlot;
}>) {
  const shared = useIntlayer("simulateShared");
  const slotLabels = useSlotLabels();
  const { data: item, isLoading } = useItemSummary(itemId);
  const slotLabel = slotLabels[slot];
  const isRight = align === "right";

  if (isLoading) {
    return <EquipmentSlotSkeleton isRight={isRight} />;
  }

  if (!item) {
    return null;
  }

  const qualityClass = QUALITY_CLASSES[item.quality] ?? "";

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 p-1.5 transition-colors hover:border-border/80",
        isRight && "sm:flex-row-reverse",
      )}
    >
      <GameTooltipWrapper tooltip={<GameTooltip id={itemId} kind="item" />}>
        <div className="shrink-0 overflow-hidden rounded-sm border border-border">
          <GameIcon iconName={item.file_name} size="md" alt={item.name} />
        </div>
      </GameTooltipWrapper>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-0.5",
          isRight ? "sm:items-end sm:text-right" : "items-start",
        )}
      >
        <span
          className={cn(
            "max-w-full truncate text-sm font-medium leading-tight",
            qualityClass,
          )}
        >
          {item.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {isRight ? (
            <>
              {slotLabel} ·{shared.itemLevelShort({ level: item.item_level })}
            </>
          ) : (
            <>
              {shared.itemLevelShort({ level: item.item_level })} ·{slotLabel}
            </>
          )}
        </span>
      </div>
    </div>
  );
}
