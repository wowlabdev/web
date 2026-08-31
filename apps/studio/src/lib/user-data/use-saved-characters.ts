"use client";

import type { QueryListResult } from "@/lib/data/result";

import { useUserData } from "@/components/shared/islands/user-data-island";
import { toListResult, useRxLiveQuery } from "@/lib/rxdb";

import type { SavedCharacter } from "./characters";

export function useSavedCharacters(): QueryListResult<SavedCharacter> {
  const userData = useUserData();

  return toListResult(
    useRxLiveQuery(
      (q) =>
        userData
          ? q
              .from({ character: userData.collections.characters })
              .orderBy(({ character }) => character.lastUsedAt, "desc")
          : null,
      [userData],
    ),
  );
}
