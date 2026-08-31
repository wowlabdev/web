"use client";

import type { GearSlot } from "wowlab-common";

import { CheckCircle2Icon, LockIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useIntlayer } from "next-intlayer";

import { useSlotLabels } from "@/components/core/simulate/use-slot-labels";
import { GameItem } from "@/components/shared/game";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { cn } from "@wowlab/shared/lib/utils";

import type { SlotState } from "./mock-data";

import { CompactItemRow } from "./compact-item-row";
type SimSlotCardProps = {
  isComplete: boolean;
  isFlashing: boolean;
  isRunning: boolean;
  slotState: SlotState;
};

export function SimSlotCard({
  isComplete,
  isFlashing,
  isRunning,
  slotState,
}: Readonly<SimSlotCardProps>) {
  const content = useIntlayer("simulateMockBags");
  const slotLabels = useSlotLabels();
  const maxLikelihood = Math.max(...slotState.items.map((i) => i.likelihood));
  const hasWinner = isComplete && slotState.items.some((i) => i.isPickedInBest);
  const winnerId = slotState.items.find((i) => i.isPickedInBest)?.itemId;
  const leader = [...slotState.items].sort(
    (a, b) => b.likelihood - a.likelihood,
  )[0];
  const slotLeaderAvgDps = leader.avgDps;

  return (
    <motion.div
      animate={isFlashing ? { scale: [1, 1.01, 1] } : {}}
      transition={{ duration: 0.4 }}
    >
      <Card
        size="sm"
        className={cn(
          "transition-all duration-300",
          isRunning && !slotState.isLocked && "ring-1 ring-primary/20",
          isFlashing &&
            "ring-2 ring-amber-400/50 shadow-lg shadow-amber-400/10",
          slotState.isLocked && isRunning && "ring-1 ring-green-500/20",
          hasWinner && "ring-1 ring-green-500/30",
        )}
      >
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1.5 text-xs">
              {slotLabels[slotState.slot as GearSlot]}
              {isRunning && !slotState.isLocked && (
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                </span>
              )}
              {slotState.isLocked && !hasWinner && (
                <LockIcon className="size-2.5 text-green-500/70" />
              )}
              {hasWinner && (
                <CheckCircle2Icon className="size-3 text-green-500" />
              )}
            </CardTitle>
            <div className="flex items-center gap-1.5">
              {slotState.leadChanges > 0 && isRunning && (
                <span className="text-[9px] text-muted-foreground/50 tabular-nums">
                  {content.swapsCount(slotState.leadChanges)}
                </span>
              )}
              <CardDescription className="text-[10px]">
                {hasWinner && winnerId ? (
                  <span className="text-green-400/80">
                    <GameItem id={winnerId} />
                  </span>
                ) : (
                  content.itemsCount(slotState.items.length)
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 px-3 pb-2">
          <AnimatePresence mode="popLayout">
            {[...slotState.items]
              .sort((a, b) => b.likelihood - a.likelihood)
              .map((itemState) => (
                <CompactItemRow
                  key={itemState.itemId}
                  itemState={itemState}
                  maxLikelihood={maxLikelihood}
                  isComplete={isComplete}
                  slotLeaderAvgDps={slotLeaderAvgDps}
                />
              ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
