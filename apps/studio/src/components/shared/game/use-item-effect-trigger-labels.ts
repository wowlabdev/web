"use client";

import { useIntlayer } from "next-intlayer";

export function useItemEffectTriggerLabels(): Record<number, string> {
  const content = useIntlayer("gameComponents");

  return {
    0: content.effectUse.value,
    1: content.effectEquip.value,
    2: content.effectChanceOnHit.value,
  };
}
