import { createRxDatabase } from "rxdb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { describe, expect, it } from "vitest";

import type { BulkBundle } from "@/lib/game-data/bulk-bundle";
import type { GameCollectionsMap, GameDb } from "@/lib/game-data/store";

import {
  decodeBulkBundle,
  encodeBulkBundle,
} from "@/lib/game-data/bulk-bundle";

import { assembleWorkerStore } from "./resolver-store";

const SAMPLE: BulkBundle = {
  combat_ratings: [
    { crit_spell: 12.15, haste_spell: 11.63, level: 80, mastery: 12.15 },
  ],
  combat_ratings_mult_by_ilvl: [{ armor_multiplier: 1, item_level: 600 }],
  curve_points: [
    { curve_id: 10, id: 1, order_index: 1, pos_0: 1.5, pos_1: 2.5 },
    { curve_id: 10, id: 2, order_index: 0, pos_0: 0.5, pos_1: 1 },
  ],
  curves: [{ flags: 0, id: 10, type: 2 }],
  expansion_traits: [{ expansion_id: 10, system: "class", trait_tree_id: 123 }],
  hp_per_sta: [{ health: 20, level: 80 }],
  item_bonuses: [
    { id: 100, parent_item_bonus_list_id: 7, type: "ItemLevel", value_0: -3 },
  ],
  item_offset_curves: [{ curve_id: 10, curve_offset: 1.25, id: 5 }],
  item_scaling_configs: [{ flags: 1, id: 8, item_level: 600 }],
  item_squish_eras: [{ curve_id: 10, id: 3, patch: "11.2.0" }],
  power_types: [{ id: 0, max_base_power: 100, power_type_enum: 1 }],
  rand_prop_points: [{ epic_0: 1.1, good_0: 0.9, id: 600 }],
  specs: [{ id: 250, mastery_spell_id_0: 77_513, name: "Blood", role: "tank" }],
  specs_traits: [
    { all_node_ids: [1, 2, 3], nodes: { a: 1, b: [4, 5] }, spec_id: 250 },
  ],
  spell_scaling: [{ item: 33.63, level: 80 }],
};

describe("assembleWorkerStore parity", () => {
  it("produces an identical store from the buffer round-trip and the direct path", async () => {
    const gameDb = await createTestGameDb();

    try {
      const direct = assembleWorkerStore(gameDb, SAMPLE);
      const roundTripped = assembleWorkerStore(
        gameDb,
        decodeBulkBundle(encodeBulkBundle(SAMPLE)),
      );

      expect(roundTripped).toEqual(direct);
      expect(roundTripped.expansionTraitsCache.get("10:class")).toEqual({
        expansion_id: 10,
        system: "class",
        trait_tree_id: 123,
      });
    } finally {
      await gameDb.close();
    }
  });
});

function createTestGameDb(): Promise<GameDb> {
  return createRxDatabase<GameCollectionsMap>({
    multiInstance: false,
    name: "resolver-parity",
    storage: getRxStorageMemory(),
  });
}
