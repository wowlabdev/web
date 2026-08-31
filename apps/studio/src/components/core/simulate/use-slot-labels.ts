"use client";

import type { GearSlot } from "wowlab-common";

import { useIntlayer } from "next-intlayer";

export function useSlotLabels(): Record<GearSlot, string> {
  const game = useIntlayer("sharedGame");

  return {
    back: game.slotBack.value,
    chest: game.slotChest.value,
    feet: game.slotFeet.value,
    finger1: game.slotFinger1.value,
    finger2: game.slotFinger2.value,
    hands: game.slotHands.value,
    head: game.slotHead.value,
    legs: game.slotLegs.value,
    main_hand: game.slotMainHand.value,
    neck: game.slotNeck.value,
    off_hand: game.slotOffHand.value,
    shirt: game.slotShirt.value,
    shoulders: game.slotShoulders.value,
    tabard: game.slotTabard.value,
    trinket1: game.slotTrinket1.value,
    trinket2: game.slotTrinket2.value,
    waist: game.slotWaist.value,
    wrists: game.slotWrists.value,
  };
}
