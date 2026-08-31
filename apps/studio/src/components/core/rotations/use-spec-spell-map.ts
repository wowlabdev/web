"use client";

import type { ImplementedSpecInfo, SpecIntrospection } from "wowlab-common";

import { useCreation } from "ahooks";

import { useCommon, useEngine } from "@/components/shared/wasm";
import { parseImplementedSpecs } from "@/lib/wasm/api";

import type { SpecSpellMap } from "./rotation-view-types";

export function useSpecSpellMap(specId: number | undefined): {
  specMap: SpecSpellMap | null;
  supported: boolean;
} {
  const common = useCommon();
  const engine = useEngine();

  return useCreation(() => {
    if (specId === undefined) {
      return { specMap: null, supported: false };
    }

    const specs = parseImplementedSpecs(
      common,
      engine.getImplementedSpecs(),
    ) as ImplementedSpecInfo[];

    if (!specs.some((s) => s.spec_id === specId)) {
      return { specMap: null, supported: false };
    }

    const introspection = engine.getSpecIntrospection(
      specId,
    ) as SpecIntrospection;

    const spells = new Map<string, number>();

    for (const spell of introspection.spells) {
      spells.set(spell.slug, spell.spell_id);
    }

    const auras = new Map<string, number>();

    for (const aura of introspection.auras) {
      auras.set(aura.slug, aura.aura_id);
    }

    return { specMap: { auras, specId, spells }, supported: true };
  }, [common, engine, specId]);
}
