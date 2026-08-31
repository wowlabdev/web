"use client";

import { useIntlayer } from "next-intlayer";

export function useInventoryTypeLabels(): Record<number, string> {
  const content = useIntlayer("gameComponents");
  const game = useIntlayer("sharedGame");

  return {
    1: game.slotHead.value,
    10: game.slotHands.value,
    11: content.slotFinger.value,
    12: content.slotTrinket.value,
    13: content.slotOneHand.value,
    14: content.slotShield.value,
    15: content.slotRanged.value,
    16: game.slotBack.value,
    17: content.slotTwoHand.value,
    18: content.slotBag.value,
    19: game.slotTabard.value,
    2: game.slotNeck.value,
    20: content.slotRobe.value,
    21: game.slotMainHand.value,
    22: game.slotOffHand.value,
    23: content.slotHeldInOffHand.value,
    25: content.slotThrown.value,
    26: content.slotRanged.value,
    3: game.slotShoulders.value,
    4: game.slotShirt.value,
    5: game.slotChest.value,
    6: game.slotWaist.value,
    7: game.slotLegs.value,
    8: game.slotFeet.value,
    9: game.slotWrists.value,
  };
}
