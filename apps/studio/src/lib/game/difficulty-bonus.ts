export type DifficultyFilter =
  "Heroic" | "LFR" | "Mythic" | "Mythic+" | "Normal" | "all";

export type LootSourceKind = "dungeon" | "raid";

/// Must match `game.item_drop_scaling.difficulty_key` and the addon's `LootModel.DIFFICULTIES`.
export const RAID_DIFFICULTY_KEYS = [
  "LFR",
  "Normal",
  "Heroic",
  "Mythic",
] as const;

export const DUNGEON_DIFFICULTY_KEYS = ["Normal", "Heroic", "Mythic"] as const;

export const DUNGEON_MYTHIC_PLUS_KEYS = [
  "MythicPlus_2_3",
  "MythicPlus_4",
  "MythicPlus_5",
  "MythicPlus_6_7",
  "MythicPlus_8_9",
  "MythicPlus_10Plus",
  "MythicPlus_VaultBR",
] as const;

const DIFFICULTY_ORDER: Record<string, number> = {
  Heroic: 2,
  LFR: 0,
  Mythic: 3,
  MythicPlus_10Plus: 9,
  MythicPlus_2_3: 4,
  MythicPlus_4: 5,
  MythicPlus_5: 6,
  MythicPlus_6_7: 7,
  MythicPlus_8_9: 8,
  MythicPlus_VaultBR: 10,
  Normal: 1,
};

const DIFFICULTY_LABEL: Record<string, string> = {
  Heroic: "Heroic",
  LFR: "LFR",
  Mythic: "Mythic",
  MythicPlus_10Plus: "Mythic+ 10+",
  MythicPlus_2_3: "Mythic+ 2-3",
  MythicPlus_4: "Mythic+ 4",
  MythicPlus_5: "Mythic+ 5",
  MythicPlus_6_7: "Mythic+ 6-7",
  MythicPlus_8_9: "Mythic+ 8-9",
  MythicPlus_VaultBR: "Great Vault",
  Normal: "Normal",
};

export function difficultyKeyLabel(key: string): string {
  return DIFFICULTY_LABEL[key] ?? key;
}

export function difficultyKeyOrder(key: string): number {
  return DIFFICULTY_ORDER[key] ?? 99;
}

export function getJournalDifficultyKeys({
  difficulty,
  isMythicPlus,
  sourceKind,
}: {
  difficulty: DifficultyFilter;
  isMythicPlus: boolean;
  sourceKind: LootSourceKind;
}): string[] {
  if (sourceKind === "raid") {
    const keys = [...RAID_DIFFICULTY_KEYS];

    if (difficulty === "all") {
      return keys;
    }

    return keys.includes(difficulty as (typeof RAID_DIFFICULTY_KEYS)[number])
      ? [difficulty]
      : [];
  }

  const mythicPlus = isMythicPlus ? [...DUNGEON_MYTHIC_PLUS_KEYS] : [];
  const keys = [...DUNGEON_DIFFICULTY_KEYS, ...mythicPlus];

  if (difficulty === "all") {
    return keys;
  }

  if (difficulty === "Mythic+") {
    return mythicPlus;
  }

  return keys.includes(difficulty as (typeof keys)[number]) ? [difficulty] : [];
}
