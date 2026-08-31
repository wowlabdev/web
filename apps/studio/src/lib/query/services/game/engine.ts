import type { SpecIntrospection } from "wowlab-common";

import { useQuery } from "@tanstack/react-query";

import { toQueryListResult, toQueryResult } from "@/lib/data/result";
import { parseImplementedSpecs } from "@/lib/wasm/api";
import { getCommon } from "@/lib/wasm/loaders/common";
import { getEngine } from "@/lib/wasm/loaders/engine";

export const WASM_COMMON_KEY = ["wasm", "common"] as const;

export const WASM_ENGINE_KEY = ["wasm", "engine"] as const;

export const ENGINE_SEARCHABLE_DATA_KEY = [
  "engine",
  "searchable-data",
] as const;

export type EngineEntry = {
  class_name: string;
  id: number;
  name: string;
  spec_name: string;
  type: "spell" | "aura";
};

type SpecMeta = { class_name: string; spec_name: string };

export function useCommonModule() {
  return toQueryResult(
    useQuery({
      queryFn: getCommon,
      queryKey: WASM_COMMON_KEY,
      staleTime: Infinity,
    }),
  );
}

export function useEngineData(enabled = true) {
  return toQueryListResult(
    useQuery({
      enabled,
      queryFn: async () => {
        const [common, engine] = await Promise.all([getCommon(), getEngine()]);
        const specs = parseImplementedSpecs(
          common,
          engine.getImplementedSpecs(),
        );
        const entries: EngineEntry[] = [];

        for (const spec of specs) {
          const introspection = engine.getSpecIntrospection(
            spec.spec_id,
          ) as SpecIntrospection;

          collectSpecEntries(entries, introspection, {
            class_name: spec.class_name,
            spec_name: spec.spec_name,
          });
        }

        return entries;
      },
      queryKey: ENGINE_SEARCHABLE_DATA_KEY,
      staleTime: Infinity,
    }),
  );
}

function addUnique(entries: EngineEntry[], entry: EngineEntry): void {
  if (!entries.some((e) => e.id === entry.id && e.type === entry.type)) {
    entries.push(entry);
  }
}

function collectHeroTalentEntries(
  entries: EngineEntry[],
  introspection: SpecIntrospection,
  meta: SpecMeta,
): void {
  for (const tree of introspection.hero_talents) {
    for (const [name, id] of tree.spells) {
      addUnique(entries, { ...meta, id, name, type: "spell" });
    }

    for (const [name, id] of tree.auras) {
      addUnique(entries, { ...meta, id, name, type: "aura" });
    }
  }
}

function collectSpecEntries(
  entries: EngineEntry[],
  introspection: SpecIntrospection,
  meta: SpecMeta,
): void {
  for (const spell of introspection.spells) {
    entries.push({
      ...meta,
      id: spell.spell_id,
      name: spell.name,
      type: "spell",
    });
  }

  for (const aura of introspection.auras) {
    entries.push({ ...meta, id: aura.aura_id, name: aura.name, type: "aura" });
  }

  collectHeroTalentEntries(entries, introspection, meta);
}
