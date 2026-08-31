import type { BulkBundle, GameRow } from "@/lib/game-data/bulk-bundle";
import type { GameDb } from "@/lib/game-data/store";

import { decodeBulkBundle } from "@/lib/game-data/bulk-bundle";
import { getGameDbLocal } from "@/lib/game-data/store";

import type { WorkerStore } from "./resolver-types";

import { buildScalingResolverData } from "./scaling";

export function assembleWorkerStore(
  gameDb: GameDb,
  bundle: BulkBundle,
): WorkerStore {
  const scalingResolver = buildScalingResolverData({
    bonuses: bundle.item_bonuses,
    combat_ratings: bundle.combat_ratings,
    combat_ratings_mult_by_ilvl: bundle.combat_ratings_mult_by_ilvl,
    curve_points: bundle.curve_points,
    curves: bundle.curves,
    hp_per_sta: bundle.hp_per_sta,
    item_offset_curves: bundle.item_offset_curves,
    item_scaling_configs: bundle.item_scaling_configs,
    item_squish_eras: bundle.item_squish_eras,
    rand_prop_points: bundle.rand_prop_points,
    spell_scaling: bundle.spell_scaling,
  });

  return {
    expansionTraitsCache: mapByCompositeFields(bundle.expansion_traits, [
      "expansion_id",
      "system",
    ]),
    gameDb,
    itemCache: new Map(),
    powerTypes: bundle.power_types,
    rotationCache: new Map(),
    scalingResolver,
    specsCache: mapByNumberField(bundle.specs, "id"),
    specsTraitsCache: mapByNumberField(bundle.specs_traits, "spec_id"),
    spellCache: new Map(),
  };
}

export async function hydrateWorkerStore(
  bulkBuffer: ArrayBuffer,
): Promise<WorkerStore> {
  const gameDb = await getGameDbLocal();

  return assembleWorkerStore(gameDb, decodeBulkBundle(bulkBuffer));
}

function compositeKey(parts: (number | string)[]): string {
  return parts.join(":");
}

function mapByCompositeFields(
  rows: GameRow[],
  fields: string[],
): Map<string, unknown> {
  const mapped = new Map<string, unknown>();

  for (const row of rows) {
    mapped.set(
      compositeKey(fields.map((field) => row[field] as number | string)),
      row,
    );
  }

  return mapped;
}

function mapByNumberField(rows: GameRow[], key: string): Map<number, unknown> {
  const mapped = new Map<number, unknown>();

  for (const row of rows) {
    mapped.set(row[key] as number, row);
  }

  return mapped;
}
