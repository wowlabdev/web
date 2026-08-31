"use client";

import type { Profile, ResolvedPaperdoll } from "wowlab-common";

import { useQuery } from "@tanstack/react-query";
import { useCreation } from "ahooks";

import { useCommon } from "@/components/shared/wasm";
import { type QueryResult, toQueryResult } from "@/lib/data/result";
import { getGameDb } from "@/lib/game-data/store";
import { getStoredSyncState } from "@/lib/game-data/sync";
import { resolvePaperdollOnWorker } from "@/lib/node/resolution-worker-client";
import { buildProfileSimConfig } from "@/lib/sim/intent";
import { useEffectiveActiveId } from "@/lib/state/character-store";
import {
  beginResolveActivity,
  endResolveActivity,
  reportResolveEvent,
} from "@/lib/state/resolve-activity-store";
import { useSavedCharacter } from "@/lib/user-data";
import {
  paperdollCacheKey,
  readCachedPaperdoll,
  writeCachedPaperdoll,
} from "@/lib/user-data/resolved-paperdoll-cache";
import { parseSimcProfile } from "@/lib/wasm/api";
import { getCommon } from "@/lib/wasm/loaders/common";

const RESOLVED_PAPERDOLL_KEY = ["character", "resolved-paperdoll"] as const;
const RESOLVED_STALE_MS = 5 * 60 * 1000;

// Gender is gone from the UI/state but the engine still requires the flag.
const DEFAULT_IS_MALE = true;

export function useEffectiveProfile(): Profile | null {
  const common = useCommon();
  const activeId = useEffectiveActiveId();
  const { data: character } = useSavedCharacter(activeId);

  return useCreation(() => {
    const simc = character?.snapshots.at(0)?.simc;

    if (!simc) {
      return null;
    }

    try {
      return parseSimcProfile(common, simc);
    } catch {
      return null;
    }
  }, [common, character]);
}

function profileCacheKey(profile: Profile | null): string {
  if (!profile) {
    return "none";
  }

  const gear = profile.equipment
    .map((i) => `${i.slot}:${i.id}:${(i.bonus_ids ?? []).join("/")}`)
    .join(",");

  return `${profile.character.level}|${profile.talents.encoded}|${gear}`;
}

const NOT_RESOLVABLE: QueryResult<ResolvedPaperdoll> = {
  data: undefined,
  error: null,
  isError: false,
  isFetching: false,
  isLoading: false,
  notFound: true,
};

export function useCurrentResolvedPaperdoll(): QueryResult<ResolvedPaperdoll> {
  const activeId = useEffectiveActiveId();
  const { data: character } = useSavedCharacter(activeId);
  const profile = useEffectiveProfile();

  return useResolvedPaperdoll(profile, character?.specId ?? 0);
}

export function useResolvedPaperdoll(
  profile: Profile | null,
  specId: number,
): QueryResult<ResolvedPaperdoll> {
  const enabled = profile != null;

  const query = useQuery({
    enabled,
    queryFn: async (): Promise<ResolvedPaperdoll> => {
      if (!profile) {
        throw new Error("profile required");
      }

      const common = await getCommon();
      const simConfig = buildProfileSimConfig(common, {
        profile,
        rotationId: "character_paperdoll",
        specId,
      });

      const key = paperdollCacheKey(profileCacheKey(profile), specId);
      const revision =
        (await getStoredSyncState(await getGameDb()))?.revision ?? null;

      if (revision != null) {
        const cached = await readCachedPaperdoll(key, revision);

        if (cached) {
          return cached;
        }
      }

      beginResolveActivity();

      try {
        const result = await resolvePaperdollOnWorker(
          simConfig,
          profile.character.level,
          DEFAULT_IS_MALE,
          reportResolveEvent,
        );

        if (revision != null) {
          await writeCachedPaperdoll(key, revision, result);
        }

        return result;
      } finally {
        endResolveActivity();
      }
    },
    queryKey: [...RESOLVED_PAPERDOLL_KEY, specId, profileCacheKey(profile)],
    staleTime: RESOLVED_STALE_MS,
  });

  return enabled ? toQueryResult(query) : NOT_RESOLVABLE;
}
