"use client";

import type { SpellSummary } from "@wowlab/shared/lib/supabase/types";

import { makeInspectSpellUrl } from "@wowlab/shared/lib/links";

import { GameTooltipShell } from "../game-tooltip-shell";
import { SpellDescription } from "../spell-description";

export type SpellTooltipBodyProps = {
  spell: SpellSummary;
  spellId: number;
  specId?: number;
};

export function SpellTooltipBody({
  specId,
  spell,
  spellId,
}: Readonly<SpellTooltipBodyProps>) {
  return (
    <GameTooltipShell
      iconName={spell.file_name}
      href={makeInspectSpellUrl(spellId)}
      header={
        <span className="relative text-sm font-semibold leading-tight text-white">
          {spell.name}
        </span>
      }
    >
      <span className="text-xs leading-relaxed text-amber-400/90">
        <SpellDescription spellId={spellId} specId={specId} />
      </span>
    </GameTooltipShell>
  );
}
