import type { BulkRow } from "./bulk-store";

import { getBulkRows, whenBulkReady } from "./bulk-store";

export type ItemDropScalingRow = BulkRow<"item_drop_scaling">;

export async function getItemDropScaling(
  itemIds: number[],
  sourceKind: "dungeon" | "raid",
  difficultyKeys: string[],
): Promise<ItemDropScalingRow[]> {
  await whenBulkReady();

  const items = new Set(itemIds);
  const difficulties = new Set(difficultyKeys);

  return getBulkRows("item_drop_scaling").filter(
    (row) =>
      row.source_kind === sourceKind &&
      items.has(row.item_id) &&
      difficulties.has(row.difficulty_key),
  );
}
