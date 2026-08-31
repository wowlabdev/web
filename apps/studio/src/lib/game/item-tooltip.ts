import type { ItemClassification, ItemDataFlat, ItemStat } from "wowlab-common";

import type { Item } from "@wowlab/shared/lib/supabase/types";

export function formatSpeed(speed: number): string {
  return (speed / 1000).toFixed(2);
}

export function toItemDataFlat(item: Item): ItemDataFlat {
  return {
    ...item,
    classification:
      (item.classification as ItemClassification | null) ?? undefined,
    dmg_variance: (item.dmg_variance as number | null) ?? 0,
    drop_sources: [],
    effects: (item.effects as ItemDataFlat["effects"] | null) ?? [],
    set_info: (item.set_info as ItemDataFlat["set_info"] | null) ?? undefined,
    stats: ((item.stats as { type: number; value: number }[] | null) ?? []).map(
      (stat): ItemStat => ({ type: stat.type, value: stat.value }),
    ),
  };
}
