"use client";

import { eq } from "@tanstack/db";

import type { QueryResult } from "@/lib/data/result";

import { useUserData } from "@/components/shared/islands/user-data-island";
import { toSingleResult, useRxLiveQuery } from "@/lib/rxdb";

import type { SavedCharacter } from "./characters";

export function useSavedCharacter(
  id: string | null,
): QueryResult<SavedCharacter> {
  const userData = useUserData();

  return toSingleResult(
    useRxLiveQuery(
      (q) =>
        userData && id
          ? q
              .from({ character: userData.collections.characters })
              .where(({ character }) => eq(character.id, id))
          : null,
      [userData, id],
    ),
  );
}
