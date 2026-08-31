import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import type { QueryListResult } from "@/lib/data/result";
import type { Item } from "@wowlab/shared/lib/supabase/types";

import { toQueryListResult } from "@/lib/data/result";
import { getItemDropScaling, type ItemDropScalingRow } from "@/lib/game-data";
import {
  difficultyKeyLabel,
  difficultyKeyOrder,
  getJournalDifficultyKeys,
} from "@/lib/game/difficulty-bonus";
import { LOOT_ITEM_CLASS_IDS } from "@/lib/game/item-class";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { throwIfError } from "../shared";
import { stringifyDropSourceFilter } from "./journal-helpers";

export const GAME_JOURNAL_EXPORT_LOOT_KEY = [
  "game",
  "journal-export-loot",
  "v3",
] as const;

export const GAME_JOURNAL_LOOT_KEY = ["game", "journal-loot"] as const;

export type JournalExportLoot = {
  items: JournalExportLootItem[];
} & JournalExportLootTarget;

export type JournalExportLootItem = {
  itemId: number;
  variants: JournalLootVariant[];
};

export type JournalExportLootTarget = {
  encounterId: number;
  instanceId: number;
  isMythicPlus: boolean;
  sourceKind: "dungeon" | "raid";
};

export type JournalLootDrop = {
  bonusVariants: JournalLootVariant[];
} & Item;

export type JournalLootVariant = {
  bonusIds: number[];
  difficultyKey: string;
  flairId: number;
  label: string;
  upgradeId: number;
};

export function buildJournalLootVariants(scalingRows: ItemDropScalingRow[]) {
  // (item_id, source_kind, difficulty_key) is unique per build; the map only guards dupes.
  const newestByKey = new Map<string, ItemDropScalingRow>();

  for (const row of scalingRows) {
    const key = `${row.item_id}:${row.source_kind}:${row.difficulty_key}`;

    newestByKey.set(key, row);
  }

  const byItem = new Map<number, JournalLootVariant[]>();

  for (const row of newestByKey.values()) {
    // Bonus IDs are [UpgradeID, FlairID]; 0 is a "none" sentinel and is dropped.
    const bonusIds = [row.upgrade_id, row.flair_id].filter((id) => id > 0);
    const variant = {
      bonusIds,
      difficultyKey: row.difficulty_key,
      flairId: row.flair_id,
      label: difficultyKeyLabel(row.difficulty_key),
      upgradeId: row.upgrade_id,
    } satisfies JournalLootVariant;

    const current = byItem.get(row.item_id) ?? [];

    current.push(variant);
    byItem.set(row.item_id, current);
  }

  for (const variants of byItem.values()) {
    variants.sort(
      (a, b) =>
        difficultyKeyOrder(a.difficultyKey) -
        difficultyKeyOrder(b.difficultyKey),
    );
  }

  return byItem;
}

export function useJournalExportLoot(
  targets: JournalExportLootTarget[],
): QueryListResult<JournalExportLoot> {
  const sortedTargets = useMemo(
    () =>
      [...targets].sort(
        (a, b) => a.instanceId - b.instanceId || a.encounterId - b.encounterId,
      ),
    [targets],
  );

  return toQueryListResult(
    useQuery({
      enabled: sortedTargets.length > 0,
      queryFn: async () => {
        const supabase = createClient();
        const loot = await Promise.all(
          sortedTargets.map(async (target): Promise<JournalExportLoot> => {
            const { data, error } = await supabase
              .schema("game")
              .from("items")
              .select("id")
              .filter(
                "drop_sources",
                "cs",
                stringifyDropSourceFilter(
                  target.encounterId,
                  target.instanceId,
                ),
              )
              .gt("inventory_type", 0)
              .in("class_id", LOOT_ITEM_CLASS_IDS)
              .order("inventory_type")
              .order("name");

            throwIfError(error);

            const itemIds = ((data ?? []) as Pick<Item, "id">[]).map(
              (item) => item.id,
            );

            if (itemIds.length === 0) {
              return { ...target, items: [] };
            }

            const difficultyKeys = getJournalDifficultyKeys({
              difficulty: "all",
              isMythicPlus: target.isMythicPlus,
              sourceKind: target.sourceKind,
            });

            if (difficultyKeys.length === 0) {
              return {
                ...target,
                items: itemIds.map((id) => ({ itemId: id, variants: [] })),
              };
            }

            const variantsByItem = buildJournalLootVariants(
              await getItemDropScaling(
                itemIds,
                target.sourceKind,
                difficultyKeys,
              ),
            );

            return {
              ...target,
              items: itemIds.map((id) => ({
                itemId: id,
                variants: variantsByItem.get(id) ?? [],
              })),
            };
          }),
        );

        return loot;
      },
      queryKey: [...GAME_JOURNAL_EXPORT_LOOT_KEY, sortedTargets],
    }),
  );
}

export function useJournalLoot({
  difficulty,
  encounterId,
  instanceId,
  isMythicPlus,
  sourceKind,
}: {
  difficulty: "Heroic" | "LFR" | "Mythic" | "Mythic+" | "Normal" | "all";
  encounterId: number;
  isMythicPlus: boolean;
  instanceId: number;
  sourceKind: "dungeon" | "raid";
}): QueryListResult<JournalLootDrop> {
  return toQueryListResult(
    useQuery({
      enabled: instanceId > 0 && encounterId > 0,
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .schema("game")
          .from("items")
          .select("*")
          .filter(
            "drop_sources",
            "cs",
            stringifyDropSourceFilter(encounterId, instanceId),
          )
          .gt("inventory_type", 0)
          .in("class_id", LOOT_ITEM_CLASS_IDS)
          .order("inventory_type")
          .order("name");

        throwIfError(error);

        const items = (data ?? []) as Item[];
        const itemIds = items.map((item) => item.id);

        if (itemIds.length === 0) {
          return [];
        }

        const difficultyKeys = getJournalDifficultyKeys({
          difficulty,
          isMythicPlus,
          sourceKind,
        });

        if (difficultyKeys.length === 0) {
          return items.map((item) => ({
            ...item,
            bonusVariants: [],
          }));
        }

        const variantsByItem = buildJournalLootVariants(
          await getItemDropScaling(itemIds, sourceKind, difficultyKeys),
        );

        return items.map((item) => ({
          ...item,
          bonusVariants: variantsByItem.get(item.id) ?? [],
        }));
      },
      queryKey: [
        ...GAME_JOURNAL_LOOT_KEY,
        sourceKind,
        instanceId,
        encounterId,
        difficulty,
        isMythicPlus,
      ],
    }),
  );
}
