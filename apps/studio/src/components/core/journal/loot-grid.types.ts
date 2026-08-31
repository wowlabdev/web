import type { ItemScalingData, ResolvedItem } from "wowlab-common";

import type { resolveItem } from "@/lib/wasm/api";
import type { Item } from "@wowlab/shared/lib/supabase/types";

import type { LootRow } from "./types";

export type LootGridRowProps = {
  common: CommonModule | undefined;
  initialResolved: ResolvedItem;
  item: Item;
  row: LootRow;
  scalingData: ItemScalingData | undefined;
};

export type ResolvedLootRow = {
  item: Item;
  resolved: ResolvedItem;
  row: LootRow;
};

type CommonModule = Parameters<typeof resolveItem>[0];
