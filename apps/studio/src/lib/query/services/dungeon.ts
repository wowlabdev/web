"use client";

import { useQuery } from "@tanstack/react-query";

import type { QueryResult } from "@/lib/data/result";

import { toQueryResult } from "@/lib/data/result";
import {
  type DungeonManifest,
  DungeonManifestSchema,
  type FloorPayload,
  FloorPayloadSchema,
} from "@/lib/zod";
import { makeDungeonDataUrl } from "@wowlab/shared/lib/links";

export const DUNGEON_MANIFEST_KEY = ["dungeon", "manifest"] as const;

export const DUNGEON_FLOOR_KEY = ["dungeon", "floor"] as const;

export function useDungeonManifest(): QueryResult<DungeonManifest> {
  return toQueryResult(
    useQuery({
      queryFn: async (): Promise<DungeonManifest> => {
        const raw = await fetchJson<unknown>(
          makeDungeonDataUrl("manifest.json"),
        );
        const result = DungeonManifestSchema.safeParse(raw);

        if (!result.success) {
          const summary = result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; ");

          throw new Error(`dungeon manifest validation failed: ${summary}`);
        }

        return result.data;
      },
      queryKey: DUNGEON_MANIFEST_KEY,
      staleTime: Infinity,
    }),
  );
}

export function useFloorPayload(
  dungeonKey: string | null,
  floor: number | null,
): QueryResult<FloorPayload> {
  return toQueryResult(
    useQuery({
      enabled: dungeonKey !== null && floor !== null,
      queryFn: async (): Promise<FloorPayload> => {
        const base = `${dungeonKey}/${floor}`;
        const [enemies, packs, patrols] = await Promise.all([
          fetchJson<unknown>(makeDungeonDataUrl(`${base}/enemies.json`)),
          fetchJson<unknown>(makeDungeonDataUrl(`${base}/enemy_packs.json`)),
          fetchJson<unknown>(makeDungeonDataUrl(`${base}/enemy_patrols.json`)),
        ]);
        const result = FloorPayloadSchema.safeParse({
          enemies,
          packs,
          patrols,
        });

        if (!result.success) {
          const summary = result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join("; ");

          throw new Error(`floor payload validation failed: ${summary}`);
        }

        return result.data;
      },
      queryKey: [...DUNGEON_FLOOR_KEY, dungeonKey, floor],
      staleTime: Infinity,
    }),
  );
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "force-cache" });

  if (!res.ok) {
    throw new Error(`fetch ${url} failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
