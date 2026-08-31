import type { ItemLevelTrack } from "@/lib/game/item-track";
import type { JournalLootVariant } from "@/lib/query/services/game";

export const difficultyScopes = [
  "all",
  "LFR",
  "Normal",
  "Heroic",
  "Mythic",
  "Mythic+",
] as const;

export const journalTabs = ["raids", "dungeons"] as const;

export type Difficulty = Exclude<DifficultyScope, "all">;

export type DifficultyScope = (typeof difficultyScopes)[number];

export type JournalEncounter = {
  creatureDisplayInfoId: number;
  dungeonEncounterId: number;
  id: number;
  imageFileDataId: number;
  imageStoragePath: string;
  orderIndex?: number;
  name: string;
  uiModelSceneId: number;
};

export type JournalSource = {
  backgroundFileDataId: number;
  backgroundStoragePath: string;
  buttonFileDataId: number;
  buttonSmallFileDataId: number;
  buttonStoragePath: string;
  difficulties: Difficulty[];
  encounters: JournalEncounter[];
  expansion?: string;
  id: string;
  instanceId: number;
  isCurrentSeason: boolean;
  isMythicPlus: boolean;
  kind: "raid" | "dungeon";
  loadscreenFileDataId: number;
  loadscreenSeoStoragePath: string;
  loadscreenStoragePath: string;
  loreFileDataId: number;
  loreStoragePath: string;
  mapId?: number;
  name: string;
  tier: string;
  tierId: number;
  tierOrderIndex: number;
};

export type JournalTab = (typeof journalTabs)[number];

export type LootItemType = "Armor" | "Trinket" | "Weapon";

export type LootRow = {
  bonusIds: number[];
  bonusVariants: JournalLootVariant[];
  encounter: string;
  encounterId: number;
  itemId: number;
  slot: string;
  source: string;
  sourceId: number;
  track: ItemLevelTrack;
  type: LootItemType;
};

export type SourceKind = JournalSource["kind"];
