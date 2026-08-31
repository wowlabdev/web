"use client";

import type { GearSlot } from "wowlab-common";

import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import {
  PAPERDOLL_LEFT_SLOTS,
  PAPERDOLL_RIGHT_SLOTS,
  PAPERDOLL_TRINKET_SLOTS,
  PAPERDOLL_WEAPON_SLOTS,
} from "@/lib/sim/slots";
import { Avatar, AvatarFallback } from "@wowlab/shared/components/ui/avatar";
import { Separator } from "@wowlab/shared/components/ui/separator";

import type { SlotState } from "./mock-data";
import type { BestSet, SimPhase } from "./source-badge";

import { SimPaperdollSlot } from "./sim-paperdoll-slot";
import { SparkCard } from "./spark-card";

type SimCharacterViewProps = {
  bestPermDps: number;
  bestSet: BestSet;
  character: { class: string; name: string; race: string };
  dpsHistory: { chunk: number; dps: number }[];
  expandedSlot: string | null;
  flashSlots: Set<string>;
  onToggleSlot: (slot: string) => void;
  phase: SimPhase;
  slots: Map<string, SlotState>;
};

export function SimCharacterView({
  bestPermDps,
  bestSet,
  character,
  dpsHistory,
  expandedSlot,
  flashSlots,
  onToggleSlot,
  phase,
  slots,
}: Readonly<SimCharacterViewProps>) {
  const content = useIntlayer("simulateMockBags");
  const fmtNumber = useNumber();
  const hasData = phase !== "idle";
  const firstDps = dpsHistory.length > 0 ? dpsHistory[0].dps : 0;
  const dpsDelta =
    firstDps > 0 ? ((bestPermDps - firstDps) / firstDps) * 100 : 0;

  function renderSlot(slot: GearSlot, align: "left" | "right") {
    return (
      <SimPaperdollSlot
        key={slot}
        align={align}
        bestSet={bestSet}
        hasData={hasData}
        isComplete={phase === "complete"}
        isExpanded={expandedSlot === slot}
        isFlashing={flashSlots.has(slot)}
        onToggle={() => onToggleSlot(slot)}
        phase={phase}
        slot={slot}
        slotState={slots.get(slot)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {hasData && bestPermDps > 0 && (
        <SparkCard
          ticker={content.sparkTicker.value}
          name={
            phase === "complete"
              ? content.sparkBestFinal.value
              : content.sparkBestConverging.value
          }
          value={fmtNumber(bestPermDps)}
          change={dpsDelta}
          chartData={dpsHistory.map((d) => ({
            label: `C${d.chunk}`,
            value: d.dps,
          }))}
        />
      )}

      <div className="flex flex-col gap-0">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3">
          <div className="flex flex-col gap-2">
            {PAPERDOLL_LEFT_SLOTS.map((slot) => renderSlot(slot, "left"))}
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <Avatar size="lg">
              <AvatarFallback>
                {character.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs font-semibold text-muted-foreground">
                {character.name}
              </span>
              <span className="text-[10px] text-muted-foreground/60">
                {character.race} {character.class}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {PAPERDOLL_RIGHT_SLOTS.map((slot) => renderSlot(slot, "right"))}
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-3">
          {PAPERDOLL_TRINKET_SLOTS.map((slot, i) =>
            renderSlot(slot, i === 0 ? "left" : "right"),
          )}
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-3">
          {PAPERDOLL_WEAPON_SLOTS.map((slot, i) =>
            renderSlot(slot, i === 0 ? "left" : "right"),
          )}
        </div>
      </div>
    </div>
  );
}
