import type { ItemScalingData, ResolvedItem } from "wowlab-common";

import type { Item } from "@wowlab/shared/lib/supabase/types";

import { toItemDataFlat } from "@/lib/game/item-tooltip";
import { resolveItem } from "@/lib/wasm/api";

type CommonModule = Parameters<typeof resolveItem>[0];

export function buildResolvedItem({
  common,
  enabledBonusIds,
  item,
  scalingData,
}: {
  common: CommonModule;
  enabledBonusIds: number[];
  item: Item;
  scalingData: ItemScalingData;
}): ResolvedItem {
  return resolveItem(
    common,
    toItemDataFlat(item),
    enabledBonusIds,
    scalingData,
  );
}

export function getBonusVariantKey(bonusIds: number[]) {
  return bonusIds.join(".");
}
