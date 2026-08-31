import { createCollectionsRegistry, mirrorCollection } from "@/lib/rxdb";

import type { SavedCharacterDoc, UserDb } from "./store";

export type UserCollections = ReturnType<typeof buildCollections>;

export const createUserCollections = createCollectionsRegistry<
  UserDb,
  UserCollections
>(buildCollections);

function buildCollections(userDb: UserDb) {
  return {
    characters: mirrorCollection<SavedCharacterDoc>(
      userDb.collections.characters,
    ),
  };
}
