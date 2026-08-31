"use client";

import { ChevronDownIcon, LockIcon } from "lucide-react";
import { motion } from "motion/react";
import { useIntlayer } from "next-intlayer";

import { GameIcon } from "@/components/shared/game";
import { useItemSummary } from "@/lib/game-data";
import { QUALITY_CLASSES } from "@/lib/game/quality";
import { cn } from "@wowlab/shared/lib/utils";

import type { SimPhase } from "./source-badge";

type SimSlotLeaderButtonProps = {
  align: "left" | "right";
  altCount: number;
  hasData: boolean;
  isBestPick: boolean;
  isExpanded: boolean;
  isFlashing: boolean;
  isLocked: boolean;
  itemId: number;
  onToggle: () => void;
  pct: number | null;
  phase: SimPhase;
  slotLabel: string;
};

export function SimSlotLeaderButton({
  align,
  altCount,
  hasData,
  isBestPick,
  isExpanded,
  isFlashing,
  isLocked,
  itemId,
  onToggle,
  pct,
  phase,
  slotLabel,
}: Readonly<SimSlotLeaderButtonProps>) {
  const shared = useIntlayer("simulateShared");
  const { data: item } = useItemSummary(itemId);
  const isRight = align === "right";

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      animate={isFlashing ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-center gap-2 rounded-lg border p-1.5 text-left transition-all duration-200 cursor-pointer",
        isRight && "flex-row-reverse",
        resolveLeaderBorderClass(isExpanded, isFlashing, isLocked, hasData),
      )}
    >
      <div
        className={cn(
          "shrink-0 overflow-hidden rounded-sm border transition-colors duration-300",
          resolveIconBorderClass(isBestPick, hasData, isFlashing),
        )}
      >
        {item && (
          <GameIcon iconName={item.file_name} size="md" alt={item.name} />
        )}
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-0.5",
          isRight && "items-end",
        )}
      >
        <div
          className={cn(
            "flex w-full items-center gap-1",
            isRight && "flex-row-reverse",
          )}
        >
          <span
            className={cn(
              "max-w-full truncate text-sm font-medium leading-tight",
              resolveItemNameClass(
                isBestPick,
                hasData,
                item ? QUALITY_CLASSES[item.quality] : undefined,
              ),
            )}
          >
            {item?.name ?? "..."}
          </span>
          {isLocked && hasData && phase !== "idle" && (
            <LockIcon className="size-2.5 shrink-0 text-green-500/70" />
          )}
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5",
            isRight && "flex-row-reverse",
          )}
        >
          <span className="text-xs text-muted-foreground">
            {isRight ? (
              <>
                {slotLabel}
                {item && (
                  <> ·{shared.itemLevelShort({ level: item.item_level })}</>
                )}
              </>
            ) : (
              <>
                {item && (
                  <>{shared.itemLevelShort({ level: item.item_level })} · </>
                )}
                {slotLabel}
              </>
            )}
          </span>
          {pct !== null && hasData && (
            <span
              className={cn(
                "text-[9px] font-semibold tabular-nums",
                pct >= 50 ? "text-foreground/70" : "text-muted-foreground/50",
              )}
            >
              {pct}%
            </span>
          )}
          {altCount > 0 && (
            <span className="text-[9px] text-muted-foreground/40">
              {isExpanded ? (
                <ChevronDownIcon className="size-2.5" />
              ) : (
                `+${altCount}`
              )}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function resolveIconBorderClass(
  isBestPick: boolean,
  hasData: boolean,
  isFlashing: boolean,
): string {
  if (isBestPick && hasData) {
    return "border-green-500/50";
  }

  if (isFlashing) {
    return "border-amber-400/50";
  }

  return "border-border";
}

function resolveItemNameClass(
  isBestPick: boolean,
  hasData: boolean,
  qualityClass: string | undefined,
): string {
  if (isBestPick && hasData) {
    return "text-green-400";
  }

  return qualityClass ?? "";
}

function resolveLeaderBorderClass(
  isExpanded: boolean,
  isFlashing: boolean,
  isLocked: boolean,
  hasData: boolean,
): string {
  if (isExpanded) {
    return "border-primary/50 bg-primary/5";
  }

  if (isFlashing) {
    return "border-amber-400/50 bg-amber-400/5";
  }

  if (isLocked && hasData) {
    return "border-green-500/30 bg-green-500/5";
  }

  return "border-border bg-muted/30 hover:border-border/80";
}
