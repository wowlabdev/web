"use client";

import { TrophyIcon } from "lucide-react";
import { motion } from "motion/react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import { GameIcon } from "@/components/shared/game";
import { useItemSummary } from "@/lib/game-data";
import { QUALITY_CLASSES } from "@/lib/game/quality";
import { cn } from "@wowlab/shared/lib/utils";

import type { ItemState } from "./mock-data";

import {
  resolveBarClass,
  resolveItemNameClass,
  resolvePctClass,
  resolveSparkColor,
} from "./compact-item-row-helpers";
import { LikelihoodSparkline } from "./likelihood-sparkline";
import { SourceBadge } from "./source-badge";

type CompactItemRowProps = {
  isComplete: boolean;
  itemState: ItemState;
  maxLikelihood: number;
  slotLeaderAvgDps: number;
};

export function CompactItemRow({
  isComplete,
  itemState,
  maxLikelihood,
  slotLeaderAvgDps,
}: Readonly<CompactItemRowProps>) {
  const shared = useIntlayer("simulateShared");
  const fmtNumber = useNumber();
  const { data: item } = useItemSummary(itemState.itemId);
  const {
    avgDps,
    isEliminated,
    isPickedInBest,
    likelihood,
    likelihoodHistory,
  } = itemState;
  const hasData = avgDps > 0;
  const pct = Math.round(likelihood * 100);
  const formattedPct = fmtNumber(likelihood, {
    maximumFractionDigits: 0,
    style: "percent",
  });
  const alpha = hasData
    ? Math.max(0.15, likelihood / Math.max(maxLikelihood, 0.01))
    : 0.5;
  const barWidth = hasData
    ? Math.max(3, (likelihood / Math.max(maxLikelihood, 0.01)) * 100)
    : 0;
  const isWinner = isComplete && isPickedInBest;

  const dpsDelta =
    hasData && slotLeaderAvgDps > 0 && avgDps !== slotLeaderAvgDps
      ? avgDps - slotLeaderAvgDps
      : null;
  const dpsDeltaPct =
    dpsDelta !== null && slotLeaderAvgDps > 0
      ? (dpsDelta / slotLeaderAvgDps) * 100
      : null;

  const sparkColor = resolveSparkColor(isWinner, isEliminated);

  if (!item) {
    return null;
  }

  const qualityClass = QUALITY_CLASSES[item.quality] ?? "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0.5 }}
      animate={{ opacity: isEliminated ? 0.15 : alpha }}
      transition={{
        layout: { bounce: 0.15, duration: 0.4, type: "spring" },
        opacity: { duration: 0.4 },
      }}
      className={cn(
        "flex items-center gap-2 rounded-sm px-1.5 py-1",
        isWinner && "bg-green-500/8",
      )}
    >
      <div
        className={cn(
          "shrink-0 overflow-hidden rounded-sm border transition-colors duration-300",
          isPickedInBest && hasData ? "border-green-500/50" : "border-border",
        )}
      >
        <GameIcon iconName={item.file_name} size="sm" alt={item.name} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 truncate">
            <span
              className={cn(
                "truncate text-xs font-medium",
                resolveItemNameClass(isEliminated, isWinner, qualityClass),
              )}
            >
              {item.name}
            </span>
            <SourceBadge source={itemState.source} />
            {isWinner && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ bounce: 0.5, type: "spring" }}
              >
                <TrophyIcon className="size-3 text-amber-400" />
              </motion.span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <LikelihoodSparkline
              history={likelihoodHistory}
              color={sparkColor}
            />
            {hasData && (
              <span
                className={cn(
                  "w-7 text-right text-[10px] font-semibold tabular-nums",
                  resolvePctClass(isWinner, pct),
                )}
              >
                {formattedPct}
              </span>
            )}
          </div>
        </div>

        <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full",
              resolveBarClass(isWinner, isEliminated),
            )}
            initial={{ width: 0 }}
            animate={{ width: `${barWidth}%` }}
            transition={{ bounce: 0.05, duration: 0.5, type: "spring" }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[9px] text-muted-foreground/50">
            {shared.itemLevelShort({ level: item.item_level })}
          </span>
          {dpsDelta !== null && dpsDeltaPct !== null && (
            <span
              className={cn(
                "text-[9px] font-medium tabular-nums",
                dpsDelta > 0 ? "text-green-400/70" : "text-red-400/70",
              )}
            >
              {fmtNumber(dpsDeltaPct / 100, {
                maximumFractionDigits: 1,
                minimumFractionDigits: 1,
                signDisplay: "exceptZero",
                style: "percent",
              })}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
