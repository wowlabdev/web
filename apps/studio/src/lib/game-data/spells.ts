"use client";

import type { QueryListResult, QueryResult } from "@/lib/data/result";
import type { Spell, SpellSummary } from "@wowlab/shared/lib/supabase/types";

import {
  ensureSpellFull,
  ensureSpellsDisplay,
  ensureSpellsFull,
} from "./display";
import { useDisplayRow, useFullEntities, useFullEntity } from "./entity-hooks";

export function useSpell(spellId: number): QueryResult<Spell> {
  return useFullEntity("spells_full", ensureSpellFull, "Spell", spellId);
}

export function useSpells(ids: number[]): QueryListResult<Spell> {
  return useFullEntities("spells_full", ensureSpellsFull, "Spell", ids);
}

export function useSpellSummary(spellId: number): QueryResult<SpellSummary> {
  return useDisplayRow(
    "spells_display",
    ensureSpellsDisplay,
    "Spell display",
    spellId,
  );
}
