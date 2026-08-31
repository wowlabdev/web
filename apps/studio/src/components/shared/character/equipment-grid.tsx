"use client";

import type { ReactNode } from "react";
import type { GearSlot, Item, Profile } from "wowlab-common";

import {
  PAPERDOLL_LEFT_SLOTS,
  PAPERDOLL_RIGHT_SLOTS,
  PAPERDOLL_TRINKET_SLOTS,
  PAPERDOLL_WEAPON_SLOTS,
} from "@/lib/sim/slots";
import { Avatar, AvatarFallback } from "@wowlab/shared/components/ui/avatar";
import { Separator } from "@wowlab/shared/components/ui/separator";

import { EquipmentSlot } from "./equipment-slot";

type EquipmentGridProps = {
  profile: Profile;
};

export function EquipmentGrid({ profile }: Readonly<EquipmentGridProps>) {
  const { character, equipment } = profile;

  function getItemId(slot: GearSlot): number | null {
    return equipment.find((i: Item) => i.slot === slot)?.id ?? null;
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col gap-2">
          {PAPERDOLL_LEFT_SLOTS.map((slot) => (
            <EquipmentSlot
              key={slot}
              align="left"
              itemId={getItemId(slot)}
              slot={slot}
            />
          ))}
        </div>

        <div className="order-first flex flex-col items-center justify-center gap-2 sm:order-none">
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
          {PAPERDOLL_RIGHT_SLOTS.map((slot) => (
            <EquipmentSlot
              key={slot}
              align="right"
              itemId={getItemId(slot)}
              slot={slot}
            />
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      <PairedSlotGrid slots={PAPERDOLL_TRINKET_SLOTS} getItemId={getItemId} />

      <Separator className="my-4" />

      <PairedSlotGrid slots={PAPERDOLL_WEAPON_SLOTS} getItemId={getItemId} />
    </div>
  );
}

function PairedSlotGrid({
  getItemId,
  slots,
}: Readonly<{
  getItemId: (slot: GearSlot) => number | null;
  slots: readonly GearSlot[];
}>): ReactNode {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {slots.map((slot, i) => (
        <EquipmentSlot
          key={slot}
          align={i === 0 ? "left" : "right"}
          itemId={getItemId(slot)}
          slot={slot}
        />
      ))}
    </div>
  );
}
