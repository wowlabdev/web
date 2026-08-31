"use client";

import type { ImplementedSpecInfo, SpecIntrospection } from "wowlab-common";

import { useMemo } from "react";

import { useCommon, useEngine } from "@/components/shared/wasm";
import { parseImplementedSpecs } from "@/lib/wasm/api";

import { type ConditionEditorCtx, type FieldDescriptorInfo } from "./types";

export function useEditorContext(specId: null | number): {
  auraSlugs: string[];
  conditionCtx: ConditionEditorCtx;
  descriptors: FieldDescriptorInfo[];
  resourceNames: string[];
  spellSlugs: string[];
} {
  const common = useCommon();
  const engine = useEngine();

  return useMemo(() => {
    let descriptors: FieldDescriptorInfo[] = [];
    let spellSlugs: string[] = [];
    let auraSlugs: string[] = [];
    let resourceNames: string[] = [];

    if (specId != null) {
      descriptors = engine.getFieldDescriptors(specId) as FieldDescriptorInfo[];

      const specs = parseImplementedSpecs(
        common,
        engine.getImplementedSpecs(),
      ) as ImplementedSpecInfo[];

      if (specs.some((s) => s.spec_id === specId)) {
        const intro = engine.getSpecIntrospection(specId) as SpecIntrospection;

        spellSlugs = intro.spells
          .map((s) => s.slug)
          .sort((a, b) => a.localeCompare(b));
        auraSlugs = intro.auras
          .map((a) => a.slug)
          .sort((a, b) => a.localeCompare(b));
        const res: string[] = [intro.resource_primary.name];

        if (intro.resource_secondary) {
          res.push(intro.resource_secondary.name);
        }

        resourceNames = res;
      }
    }

    const conditionCtx: ConditionEditorCtx = {
      auraSlugs,
      depth: 0,
      descriptors,
      resourceNames,
      spellSlugs,
    };

    return {
      auraSlugs,
      conditionCtx,
      descriptors,
      resourceNames,
      spellSlugs,
    };
  }, [common, engine, specId]);
}
