"use client";

import { motion } from "motion/react";

import { GameIcon } from "@/components/shared/game";
import { useItemSummary } from "@/lib/game-data";
import { QUALITY_CLASSES } from "@/lib/game/quality";
import {
  computeDpsDeltaPct,
  computeLikelihoodAlpha,
} from "@/lib/sim/slot-calculations";
import { cn } from "@wowlab/shared/lib/utils";

import type { ItemState } from "./mock-data";
import type { BestSet } from "./source-badge";

type SimSlotAlternativeProps = {
  align: "left" | "right";
  bestSet: BestSet;
  hasData: boolean;
  isComplete: boolean;
  itemState: ItemState;
  maxLikelihood: number;
  slot: string;
  slotLeaderAvgDps: number;
};

export function SimSlotAlternative({
  align,
  bestSet,
  hasData,
  isComplete,
  itemState,
  maxLikelihood,
  slot,
  slotLeaderAvgDps,
}: Readonly<SimSlotAlternativeProps>) {
  const { data: item } = useItemSummary(itemState.itemId);
  const { avgDps, isEliminated, likelihood } = itemState;
  const isRight = align === "right";
  const pct = Math.round(likelihood * 100);
  const alpha = computeLikelihoodAlpha(hasData, likelihood, maxLikelihood);
  const isBestPick = bestSet[slot] === itemState.itemId;
  const isWinner = isComplete && isBestPick;

  const dpsDelta = computeDpsDeltaPct(avgDps, slotLeaderAvgDps);

  if (!item) {
    return null;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: isEliminated ? 0.15 : alpha }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-center gap-1.5 py-0.5",
        isRight && "flex-row-reverse",
        isWinner && "rounded-sm bg-green-500/5",
      )}
    >
      <div
        className={cn(
          "shrink-0 overflow-hidden rounded-sm border",
          isBestPick && hasData ? "border-green-500/50" : "border-border/50",
        )}
      >
        <GameIcon iconName={item.file_name} size="sm" alt={item.name} />
      </div>
      <div
        className={cn("flex min-w-0 flex-1 flex-col", isRight && "items-end")}
      >
        <span
          className={cn(
            "truncate text-[10px] font-medium",
            resolveAlternativeNameClass(
              isEliminated,
              isWinner,
              QUALITY_CLASSES[item.quality] ?? "",
            ),
          )}
        >
          {item.name}
        </span>
        <div
          className={cn(
            "flex items-center gap-1",
            isRight && "flex-row-reverse",
          )}
        >
          <span className="text-[8px] text-muted-foreground/50">
            {item.item_level}
          </span>
          {hasData && (
            <span
              className={cn(
                "text-[8px] font-semibold tabular-nums",
                pct >= 30
                  ? "text-muted-foreground/60"
                  : "text-muted-foreground/30",
              )}
            >
              {pct}%
            </span>
          )}
          {dpsDelta !== null && (
            <span
              className={cn(
                "text-[8px] font-medium tabular-nums",
                dpsDelta > 0 ? "text-green-400/60" : "text-red-400/60",
              )}
            >
              {dpsDelta > 0 ? "+" : ""}
              {dpsDelta.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function resolveAlternativeNameClass(
  isEliminated: boolean,
  isWinner: boolean,
  qualityClass: string,
): string {
  if (isEliminated) {
    return "text-muted-foreground/50 line-through";
  }

  if (isWinner) {
    return "text-green-400";
  }

  return qualityClass;
}
