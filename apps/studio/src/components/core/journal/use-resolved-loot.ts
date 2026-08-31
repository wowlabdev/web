import type { ItemScalingData } from "wowlab-common";

import { useMemo } from "react";

import type { resolveItem } from "@/lib/wasm/api";
import type { Item } from "@wowlab/shared/lib/supabase/types";

import type { ResolvedLootRow } from "./loot-grid.types";
import type { LootRow } from "./types";

import { buildResolvedItem } from "./loot-grid-scaling";

export type ResolvedLootStatus = "empty" | "loading" | "ready";

type CommonModule = Parameters<typeof resolveItem>[0];

export function useResolvedLoot({
  common,
  isFetching,
  items,
  loot,
  scalingData,
}: {
  common: CommonModule | undefined;
  isFetching: boolean;
  items: Item[] | undefined;
  loot: LootRow[];
  scalingData: ItemScalingData | undefined;
}): { rows: ResolvedLootRow[]; status: ResolvedLootStatus } {
  const itemsById = useMemo(
    () => new Map((items ?? []).map((item) => [item.id, item])),
    [items],
  );
  const hasLoot = loot.length > 0;
  const dataReady =
    !isFetching &&
    !!common &&
    !!scalingData &&
    (!hasLoot || loot.every((row) => itemsById.has(row.itemId)));

  const rows = useMemo((): ResolvedLootRow[] => {
    if (!common || !scalingData) {
      return [];
    }

    if (!dataReady) {
      return [];
    }

    return loot.flatMap((row) => {
      const item = itemsById.get(row.itemId);

      if (!item) {
        return [];
      }

      return [
        {
          item,
          resolved: buildResolvedItem({
            common,
            enabledBonusIds: row.bonusIds,
            item,
            scalingData,
          }),
          row,
        },
      ];
    });
  }, [common, dataReady, itemsById, loot, scalingData]);

  const status = resolveLootStatus(dataReady, rows.length);

  return { rows, status };
}

function resolveLootStatus(
  dataReady: boolean,
  rowCount: number,
): ResolvedLootStatus {
  if (!dataReady) {
    return "loading";
  }

  if (rowCount === 0) {
    return "empty";
  }

  return "ready";
}
