import type { ItemClassification } from "wowlab-common";

import type { JournalInstance } from "@/lib/game-data";
import type { JournalLootDrop } from "@/lib/query/services/game";

import { difficultyKeyOrder } from "@/lib/game/difficulty-bonus";
import {
  INVENTORY_TYPE_TRINKET,
  ITEM_CLASS_WEAPON,
} from "@/lib/game/item-class";
import { resolveItemLevelTrack } from "@/lib/game/item-track";

import type { JournalEncounter, JournalSource, LootRow } from "./types";

export function toJournalSource(instance: JournalInstance): JournalSource {
  if (instance.kind !== "raid" && instance.kind !== "dungeon") {
    throw new Error(`Unsupported journal instance kind: ${instance.kind}`);
  }

  const kind = instance.kind;

  return {
    backgroundFileDataId: instance.background_file_data_id,
    backgroundStoragePath: instance.background_storage_path,
    buttonFileDataId: instance.button_file_data_id,
    buttonSmallFileDataId: instance.button_small_file_data_id,
    buttonStoragePath: instance.button_storage_path,
    difficulties: getDifficulties({
      isMythicPlus: instance.is_mythic_plus,
      kind,
    }),
    encounters: instance.encounters.map((encounter) => ({
      creatureDisplayInfoId: encounter.creature_display_info_id,
      dungeonEncounterId: encounter.dungeon_encounter_id,
      id: encounter.id,
      imageFileDataId: encounter.image_file_data_id,
      imageStoragePath: encounter.image_storage_path,
      name: encounter.name,
      orderIndex: encounter.order_index,
      uiModelSceneId: encounter.ui_model_scene_id,
    })),
    id: String(instance.id),
    instanceId: instance.id,
    isCurrentSeason: instance.is_current_season,
    isMythicPlus: instance.is_mythic_plus,
    kind,
    loadscreenFileDataId: instance.loadscreen_file_data_id,
    loadscreenSeoStoragePath: instance.loadscreen_seo_storage_path,
    loadscreenStoragePath: instance.loadscreen_storage_path,
    loreFileDataId: instance.lore_file_data_id,
    loreStoragePath: instance.lore_storage_path,
    mapId: instance.map_id,
    name: instance.name,
    tier: instance.tier_name,
    tierId: instance.tier_id,
    tierOrderIndex: instance.tier_order_index,
  };
}

export function toLootRow(
  item: JournalLootDrop,
  source: JournalSource,
  encounter: JournalEncounter,
): LootRow {
  const classification = item.classification as ItemClassification | null;

  // Highest difficulty's bonuses; the grid recomputes scaled item level from these via WASM.
  const bestVariant = [...item.bonusVariants]
    .sort(
      (a, b) =>
        difficultyKeyOrder(b.difficultyKey) -
        difficultyKeyOrder(a.difficultyKey),
    )
    .at(0);

  return {
    bonusIds: bestVariant?.bonusIds ?? [],
    bonusVariants: item.bonusVariants,
    encounter: encounter.name,
    encounterId: encounter.id,
    itemId: item.id,
    slot: classification?.inventory_type_name ?? String(item.inventory_type),
    source: source.name,
    sourceId: source.instanceId,
    track: resolveItemLevelTrack(item.item_level),
    type: getItemType(item),
  };
}

function getDifficulties(
  source: Pick<JournalSource, "isMythicPlus" | "kind">,
): JournalSource["difficulties"] {
  if (source.kind === "raid") {
    return ["LFR", "Normal", "Heroic", "Mythic"];
  }

  return source.isMythicPlus
    ? ["Normal", "Heroic", "Mythic", "Mythic+"]
    : ["Normal", "Heroic", "Mythic"];
}

function getItemType(item: {
  class_id: number;
  inventory_type: number;
}): LootRow["type"] {
  if (item.inventory_type === INVENTORY_TYPE_TRINKET) {
    return "Trinket";
  }

  if (item.class_id === ITEM_CLASS_WEAPON) {
    return "Weapon";
  }

  return "Armor";
}
