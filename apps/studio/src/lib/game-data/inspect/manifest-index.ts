"use client";

import type { ImplementedSpecInfo, SpecIntrospection } from "wowlab-common";

import { useQuery } from "@tanstack/react-query";

import { parseImplementedSpecs } from "@/lib/wasm/api";
import { getCommon } from "@/lib/wasm/loaders/common";
import { getEngine } from "@/lib/wasm/loaders/engine";

export type ManifestIndex = {
  byId: Map<number, ManifestRef[]>;
  specs: ImplementedSpecInfo[];
};

export type ManifestKind = "aura" | "spell";

export type ManifestRef = {
  className: string;
  kind: ManifestKind;
  name: string;
  slug: string;
  specId: number;
  specName: string;
};

const MANIFEST_INDEX_KEY = ["engine", "manifest-index"] as const;

export function useManifestIndex() {
  return useQuery({
    queryFn: async (): Promise<ManifestIndex> => {
      const [common, engine] = await Promise.all([getCommon(), getEngine()]);
      const specs = parseImplementedSpecs(common, engine.getImplementedSpecs());
      const byId = new Map<number, ManifestRef[]>();

      const add = (id: number, ref: ManifestRef) => {
        if (id <= 0) {
          return;
        }

        const existing = byId.get(id);

        if (existing) {
          existing.push(ref);
        } else {
          byId.set(id, [ref]);
        }
      };

      for (const spec of specs) {
        const intro = engine.getSpecIntrospection(
          spec.spec_id,
        ) as SpecIntrospection;

        const meta = {
          className: spec.class_name,
          specId: spec.spec_id,
          specName: spec.display_name,
        };

        for (const spell of intro.spells) {
          add(spell.spell_id, {
            ...meta,
            kind: "spell",
            name: spell.name,
            slug: spell.slug,
          });
        }

        for (const aura of intro.auras) {
          add(aura.aura_id, {
            ...meta,
            kind: "aura",
            name: aura.name,
            slug: aura.slug,
          });
        }

        for (const tree of intro.hero_talents) {
          for (const [name, id] of tree.spells) {
            add(id, { ...meta, kind: "spell", name, slug: name });
          }

          for (const [name, id] of tree.auras) {
            add(id, { ...meta, kind: "aura", name, slug: name });
          }
        }
      }

      return { byId, specs };
    },
    queryKey: MANIFEST_INDEX_KEY,
    staleTime: Infinity,
  });
}
