import { pascalCase } from "change-case";

import type {
  JournalExportLoot,
  JournalLootVariant,
} from "@/lib/query/services/game";

import { type LuaObject, type LuaValue, serializeLuaValue } from "@/lib/lua";

import type { JournalSource } from "./types";

export type LootModelFile = {
  fileName: string;
  lua: string;
};

type LootModelExportOptions = {
  difficultyKeys: Set<string>;
  loot: JournalExportLoot[];
  sources: JournalSource[];
};

// One file per source at `Data/Instances/{Raids,Dungeons}/<Name>.lua`; instances with no loot at the selected difficulties are skipped.
export function buildLootModelFiles({
  difficultyKeys,
  loot,
  sources,
}: LootModelExportOptions): LootModelFile[] {
  const lootByEncounter = new Map(
    loot.map((entry) => [`${entry.instanceId}:${entry.encounterId}`, entry]),
  );

  const files: LootModelFile[] = [];

  for (const source of sources) {
    const bosses = source.encounters.map((encounter) => ({
      BossID: encounter.dungeonEncounterId || encounter.id,
      LootPool: buildLootPool(
        lootByEncounter.get(`${source.instanceId}:${encounter.id}`),
        difficultyKeys,
      ),
      Name: encounter.name,
    }));

    const itemCount = bosses.reduce(
      (sum, boss) => sum + boss.LootPool.length,
      0,
    );

    if (itemCount === 0) {
      continue;
    }

    const instance = {
      Bosses: bosses,
      InstanceID: source.instanceId,
      Name: source.name,
      Type: source.kind === "raid" ? "Raid" : "Dungeon",
    } satisfies LuaValue;

    const lua = [
      "WoWLab = WoWLab or {}",
      "WoWLab.LootModel = WoWLab.LootModel or {}",
      "WoWLab.LootModel.INSTANCES = WoWLab.LootModel.INSTANCES or {}",
      "",
      "local LootModel = WoWLab.LootModel",
      "",
      `table.insert(LootModel.INSTANCES, ${serializeLuaValue(instance)})`,
    ].join("\n");

    const directory = source.kind === "raid" ? "Raids" : "Dungeons";

    files.push({
      fileName: `${directory}/${pascalCase(source.name)}.lua`,
      lua,
    });
  }

  return files;
}

function buildItemBonusIds(
  variants: JournalLootVariant[],
  difficultyKeys: Set<string>,
): LuaObject | null {
  const bonusIds: LuaObject = {};
  let hasDifficulty = false;

  for (const variant of variants) {
    if (!difficultyKeys.has(variant.difficultyKey)) {
      continue;
    }

    hasDifficulty = true;
    bonusIds[variant.difficultyKey] = buildVariantValue(variant);
  }

  return hasDifficulty ? bonusIds : null;
}

function buildLootPool(
  entry: JournalExportLoot | undefined,
  difficultyKeys: Set<string>,
): LuaObject[] {
  const lootPool: LuaObject[] = [];

  for (const item of entry?.items ?? []) {
    const bonusIds = buildItemBonusIds(item.variants, difficultyKeys);

    if (bonusIds) {
      lootPool.push({ BonusIDs: bonusIds, ItemID: item.itemId });
    }
  }

  return lootPool;
}

function buildVariantValue(variant: JournalLootVariant): LuaObject {
  // Never flair-only: no upgrade resolves to the baseline empty table.
  if (variant.upgradeId === 0) {
    return {};
  }

  const pair: LuaObject = { UpgradeID: variant.upgradeId };

  if (variant.flairId !== 0) {
    pair.FlairID = variant.flairId;
  }

  return pair;
}
