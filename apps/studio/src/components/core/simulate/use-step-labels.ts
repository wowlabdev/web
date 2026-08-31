"use client";

import { useIntlayer } from "next-intlayer";

export function useStepLabels(): Record<string, string> {
  const shared = useIntlayer("simulateShared");

  return {
    configure: shared.stepConfigure.value,
    import: shared.stepImport.value,
    inventory: shared.stepInventory.value,
    sources: shared.stepSources.value,
  };
}
