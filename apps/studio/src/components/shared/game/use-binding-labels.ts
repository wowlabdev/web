"use client";

import { useIntlayer } from "next-intlayer";

export function useBindingLabels(): Record<number, string> {
  const content = useIntlayer("gameComponents");

  return {
    1: content.bindingOnPickup.value,
    2: content.bindingOnEquip.value,
    3: content.bindingOnUse.value,
  };
}
