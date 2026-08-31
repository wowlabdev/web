"use client";

import type { GearSlot } from "wowlab-common";

import { AnimatePresence, motion } from "motion/react";
import { useIntlayer } from "next-intlayer";

import { useSlotLabels } from "@/components/core/simulate/use-slot-labels";
import { cn } from "@wowlab/shared/lib/utils";

import type { SlotState } from "./mock-data";
import type { BestSet, SimPhase } from "./source-badge";

import { SimSlotAlternative } from "./sim-slot-alternative";
import { SimSlotLeaderButton } from "./sim-slot-leader-button";

type SimPaperdollSlotProps = {
  align: "left" | "right";
  bestSet: BestSet;
  hasData: boolean;
  isComplete: boolean;
  isExpanded: boolean;
  isFlashing: boolean;
  onToggle: () => void;
  phase: SimPhase;
  slot: GearSlot;
  slotState: SlotState | undefined;
};

export function SimPaperdollSlot({
  align,
  bestSet,
  hasData,
  isComplete,
  isExpanded,
  isFlashing,
  onToggle,
  phase,
  slot,
  slotState,
}: Readonly<SimPaperdollSlotProps>) {
  const shared = useIntlayer("simulateShared");
  const slotLabels = useSlotLabels();
  const isRight = align === "right";
  const slotLabel = slotLabels[slot];

  if (!slotState) {
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 p-1.5 transition-colors hover:border-border/80",
          isRight && "flex-row-reverse",
        )}
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-xs text-muted-foreground">
          —
        </div>
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col gap-0.5",
            isRight && "items-end",
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

  const sorted = [...slotState.items].sort(
    (a, b) => b.likelihood - a.likelihood,
  );
  const leader = sorted[0];
  const pct = hasData ? Math.round(leader.likelihood * 100) : null;
  const isLocked = slotState.isLocked;
  const isBestPick = bestSet[slotState.slot] === leader.itemId;
  const maxLikelihood = Math.max(...slotState.items.map((i) => i.likelihood));
  const slotLeaderAvgDps = leader.avgDps;
  const alternatives = sorted.slice(1);

  return (
    <div className="flex flex-col gap-0">
      <SimSlotLeaderButton
        align={align}
        altCount={alternatives.length}
        hasData={hasData}
        isBestPick={isBestPick}
        isExpanded={isExpanded}
        isFlashing={isFlashing}
        isLocked={isLocked}
        itemId={leader.itemId}
        onToggle={onToggle}
        pct={pct}
        phase={phase}
        slotLabel={slotLabel}
      />

      <AnimatePresence>
        {isExpanded && alternatives.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "ml-1 border-l border-border/50 pl-1.5 py-0.5",
                isRight &&
                  "ml-0 mr-1 border-l-0 border-r border-border/50 pl-0 pr-1.5",
              )}
            >
              {alternatives.map((itemState) => (
                <SimSlotAlternative
                  key={itemState.itemId}
                  align={align}
                  bestSet={bestSet}
                  hasData={hasData}
                  isComplete={isComplete}
                  itemState={itemState}
                  maxLikelihood={maxLikelihood}
                  slot={slotState.slot}
                  slotLeaderAvgDps={slotLeaderAvgDps}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
