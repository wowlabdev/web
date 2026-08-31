"use client";

import { useIntlayer } from "next-intlayer";

import type { SourceCategory } from "@/lib/sim/sources";

export function useSourceCategoryLabels(): Record<SourceCategory, string> {
  const game = useIntlayer("sharedGame");

  return {
    crafted: game.sourceCategoryByCrafted.value,
    dungeons: game.sourceCategoryDungeons.value,
    pvp: game.sourceCategoryPvp.value,
    raids: game.sourceCategoryRaids.value,
    vault: game.sourceCategoryVault.value,
    world: game.sourceCategoryWorld.value,
  };
}
