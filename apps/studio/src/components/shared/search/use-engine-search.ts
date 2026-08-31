"use client";

import { useMemo } from "react";

import { type EngineEntry, useEngineData } from "@/lib/query/services";
import { createSearchIndex } from "@/lib/search/search";
import { makeInspectSpellUrl } from "@wowlab/shared/lib/links";

export function useEngineSearch(query: string, enabled = true): EngineEntry[] {
  const engineData = useEngineData(enabled);

  const engineEntryMap = useMemo(() => {
    if (!engineData.data) {
      return null;
    }

    const map = new Map<string, EngineEntry>();

    for (const e of engineData.data) {
      map.set(`engine:${e.type}:${e.id}`, e);
    }

    return map;
  }, [engineData.data]);

  const engineSearch = useMemo(() => {
    if (!engineEntryMap) {
      return null;
    }

    return createSearchIndex(
      [...engineEntryMap.entries()].map(([id, e]) => ({
        category: "Spells",
        description: e.spec_name,
        id,
        path: makeInspectSpellUrl(e.id),
        title: e.name,
      })),
    );
  }, [engineEntryMap]);

  return useMemo(() => {
    if (!engineSearch || query.trim().length < 2) {
      return [];
    }

    return engineSearch(query.trim(), 20)
      .map((r) => engineEntryMap!.get(r.id))
      .filter((e): e is EngineEntry => e != null);
  }, [engineSearch, engineEntryMap, query]);
}
