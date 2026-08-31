import {
  addRxPlugin,
  type RxCollection,
  type RxDatabase,
  type RxJsonSchema,
} from "rxdb";
import { RxDBLocalDocumentsPlugin } from "rxdb/plugins/local-documents";

import type {
  GameRow,
  ItemSummary,
  SpellSummary,
} from "@wowlab/shared/lib/supabase/types";

import { createRxdbSingleton } from "@/lib/rxdb";

addRxPlugin(RxDBLocalDocumentsPlugin);

export type GameCollectionDocuments = {
  enchantments: { pk: string } & GameRow<"enchantments">;
  expected_stats: { pk: string } & GameRow<"expected_stats">;
  item_damage_scaling: { pk: string } & GameRow<"item_damage_scaling">;
  items_display: ItemSummaryDoc;
  items_full: { pk: string } & GameRow<"items">;
  spells_display: SpellSummaryDoc;
  spells_full: { pk: string } & GameRow<"spells">;
};

export type GameCollectionsMap = {
  [Name in GameCollectionName]: RxCollection<GameCollectionDocuments[Name]>;
};
export type GameDoc = Record<string, unknown>;

export type ItemSummaryDoc = { pk: string } & ItemSummary;

export type SpellSummaryDoc = { pk: string } & SpellSummary;

const ON_DEMAND_COLLECTION_NAMES = [
  "items_display",
  "items_full",
  "spells_display",
  "spells_full",
  "enchantments",
  "expected_stats",
  "item_damage_scaling",
] as const;

export type GameCollectionName = (typeof ON_DEMAND_COLLECTION_NAMES)[number];

export const GAME_COLLECTION_NAMES: readonly GameCollectionName[] =
  ON_DEMAND_COLLECTION_NAMES;

export type GameDb = RxDatabase<GameCollectionsMap>;

export function storedDocumentToRow<T extends { pk: string }>(
  document: T,
  expectedPk: string,
): Omit<T, "pk"> {
  const { pk, ...row } = document;

  if (pk !== expectedPk) {
    throw new TypeError(
      `Stored game row has primary key ${pk}, expected ${expectedPk}`,
    );
  }

  return row;
}

async function addGameCollections(db: GameDb): Promise<void> {
  await db.addCollections({
    enchantments: { schema: schema() },
    expected_stats: {
      schema: schema(),
    },
    item_damage_scaling: {
      schema: schema(),
    },
    items_display: {
      schema: schema(),
    },
    items_full: { schema: schema() },
    spells_display: {
      schema: schema(),
    },
    spells_full: { schema: schema() },
  });
}

function schema(): RxJsonSchema<{ pk: string }> {
  return {
    primaryKey: "pk",
    properties: { pk: { maxLength: 64, type: "string" } },
    required: ["pk"],
    type: "object",
    version: 0,
  };
}

export const { getDb: getGameDb, purgeDb: purgeGameDb } =
  createRxdbSingleton<GameCollectionsMap>({
    addCollections: addGameCollections,
    localDocuments: true,
    multiInstance: true,
    name: "wowlab-game",
  });

export const { getDb: getGameDbLocal } =
  createRxdbSingleton<GameCollectionsMap>({
    addCollections: addGameCollections,
    localDocuments: true,
    multiInstance: false,
    name: "wowlab-game",
  });
