import { type RxCollection, type RxDatabase, type RxJsonSchema } from "rxdb";

import { createRxdbSingleton } from "@/lib/rxdb";

import {
  type ResolvedPaperdollDoc,
  resolvedPaperdollSchema,
} from "./resolved-paperdoll-schema";

export type CharacterSnapshotDoc = {
  importedAt: number;
  simc: string;
};

// Only specId/name are denormalized (read without WASM); everything else is re-parsed from snapshots.
export type SavedCharacterDoc = {
  createdAt: number;
  id: string;
  lastUsedAt: number;
  name: string;
  snapshots: CharacterSnapshotDoc[];
  specId: number;
  updatedAt: number;
};

export type UserCollections = {
  characters: RxCollection<SavedCharacterDoc>;
  resolvedPaperdolls: RxCollection<ResolvedPaperdollDoc>;
};

export type UserDb = RxDatabase<UserCollections>;

function characterSchema(): RxJsonSchema<SavedCharacterDoc> {
  return {
    indexes: ["lastUsedAt"],
    primaryKey: "id",
    properties: {
      createdAt: { type: "number" },
      id: { maxLength: 200, type: "string" },
      lastUsedAt: {
        maximum: 9_999_999_999_999,
        minimum: 0,
        multipleOf: 1,
        type: "number",
      },
      name: { type: "string" },
      snapshots: {
        items: {
          properties: {
            importedAt: { type: "number" },
            simc: { type: "string" },
          },
          required: ["simc", "importedAt"],
          type: "object",
        },
        type: "array",
      },
      specId: { type: "number" },
      updatedAt: { type: "number" },
    },
    required: [
      "id",
      "name",
      "specId",
      "snapshots",
      "lastUsedAt",
      "createdAt",
      "updatedAt",
    ],
    type: "object",
    version: 0,
  };
}

export const { getDb: getUserDb, purgeDb: purgeUserDb } =
  createRxdbSingleton<UserCollections>({
    addCollections: async (db) => {
      await db.addCollections({
        characters: { schema: characterSchema() },
        resolvedPaperdolls: { schema: resolvedPaperdollSchema() },
      });
    },
    multiInstance: true,
    name: "wowlab-user",
  });
