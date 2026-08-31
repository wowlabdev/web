"use client";

import type {
  SpellDescRenderResult,
  SpellRenderInput,
  SpellRenderSpell,
} from "wowlab-common";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import type { Spell } from "@wowlab/shared/lib/supabase/types";

import { useSpecPaperdollProfile } from "@/components/shared/character/use-spec-paperdoll-profile";
import { useCommon, WasmBoundary } from "@/components/shared/wasm";
import { useSpell, useSpells } from "@/lib/game-data";
import { useEffectiveProfile, useResolvedPaperdoll } from "@/lib/sim/character";
import { useEffectiveActiveId } from "@/lib/state/character-store";
import { useSavedCharacter } from "@/lib/user-data";
import { analyzeSpellDesc, renderSpellDescWithData } from "@/lib/wasm/api";
import { parse, SpellEffectsSchema } from "@/lib/zod";
import { cn } from "@wowlab/shared/lib/utils";

import { FragmentRenderer } from "./fragment-renderer";

export type SpellDescriptionProps = {
  className?: string;
  description?: string;
  fallback?: string;
  spellId: number;
  specId?: number;
};

export function SpellDescription(props: Readonly<SpellDescriptionProps>) {
  const { className, description, fallback } = props;
  const content = useIntlayer("gameComponents");

  return (
    <WasmBoundary
      fallback={
        <span className={className}>
          {description ?? fallback ?? content.noDescription.value}
        </span>
      }
    >
      <SpellDescriptionInner {...props} />
    </WasmBoundary>
  );
}

function SpellDescriptionInner({
  className,
  description,
  fallback,
  specId,
  spellId,
}: Readonly<SpellDescriptionProps>) {
  const content = useIntlayer("gameComponents");
  const { isLoading, result } = useSpellDescription(
    spellId,
    description,
    specId,
  );

  if (isLoading || !result) {
    return (
      <span className={cn(className, "whitespace-pre-line")}>
        {description ?? fallback ?? content.noDescription.value}
      </span>
    );
  }

  return (
    <span className={cn(className, "whitespace-pre-line")}>
      <FragmentRenderer fragments={result.fragments} />
    </span>
  );
}

function toRenderSpell(spell: Spell, description?: string): SpellRenderSpell {
  return {
    // Effects MUST stay raw snake_case DB JSON; camelCase parsing zeroes values across the wasm boundary.
    cast_time: spell.cast_time,
    description: description ?? spell.description,
    description_variables: spell.description_variables,
    duration: spell.duration,
    effects: parse(SpellEffectsSchema, spell.effects, []),
    file_name: spell.file_name,
    id: spell.id,
    // Browser DB has no category_recovery_time column; recovery_time is the only cooldown source.
    internal_cooldown: spell.recovery_time,
    max_charges: spell.max_charges,
    max_stacks: spell.max_stacks,
    name: spell.name,
    proc_rppm: (spell.rppm_base_rate as null | number) ?? 0,
    range_max_0: (spell.range_max_0 as null | number) ?? 0,
    recovery_time: spell.recovery_time,
  };
}

function useSpellDescription(
  spellId: number,
  description?: string,
  specId?: number,
): {
  isLoading: boolean;
  result: SpellDescRenderResult | null;
} {
  const common = useCommon();

  const { data: spell } = useSpell(spellId);
  const spellLoading = !spell;

  const descriptionText = description ?? spell?.description ?? "";

  const crossSpellIds = useMemo(() => {
    if (!descriptionText) {
      return [];
    }

    try {
      const analyzed = analyzeSpellDesc(common, descriptionText, spellId);
      const ids = new Set<number>();

      for (const eff of analyzed.dependencies.effects) {
        if (eff.spellId !== spellId) {
          ids.add(eff.spellId);
        }
      }

      for (const sv of analyzed.dependencies.spellValues) {
        if (sv.spellId !== spellId) {
          ids.add(sv.spellId);
        }
      }

      for (const embed of analyzed.dependencies.embeddedSpellIds) {
        ids.add(embed);
      }

      return [...ids];
    } catch {
      return [];
    }
  }, [common, descriptionText, spellId]);

  const { data: crossSpells = [], isLoading: crossSpellsLoading } =
    useSpells(crossSpellIds);

  // Prefer the spec's BiS paperdoll, else the active saved character; wait if neither is present.
  const { profile: specProfile, row: specRow } = useSpecPaperdollProfile(
    specId ?? null,
  );
  const currentProfile = useEffectiveProfile();
  const activeId = useEffectiveActiveId();
  const { data: activeCharacter } = useSavedCharacter(activeId);
  const useSpecPaperdoll =
    specId != null && specRow != null && specProfile != null;
  const effectiveProfile = useSpecPaperdoll ? specProfile : currentProfile;
  const effectiveSpecId = useSpecPaperdoll
    ? specId
    : (activeCharacter?.specId ?? 0);
  const { data: paperdoll, isLoading: paperdollLoading } = useResolvedPaperdoll(
    effectiveProfile,
    effectiveSpecId,
  );

  const renderResult = useMemo(() => {
    if (!descriptionText || !spell || crossSpellsLoading || !paperdoll) {
      return null;
    }

    try {
      const input: SpellRenderInput = {
        cross_spells: crossSpells.map((s) => toRenderSpell(s)),
        paperdoll,
        self_spell: toRenderSpell(spell, descriptionText),
      };

      return renderSpellDescWithData(common, input);
    } catch {
      return null;
    }
  }, [
    common,
    descriptionText,
    spell,
    crossSpells,
    crossSpellsLoading,
    paperdoll,
  ]);

  return {
    isLoading: spellLoading || crossSpellsLoading || paperdollLoading,
    result: renderResult,
  };
}
