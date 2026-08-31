"use client";

import {
  DEFAULT_SPELL_ID,
  SAMPLE_SPELL_IDS,
} from "@/components/int/__fixtures__/game-fixtures";
import { GameSpell } from "@/components/shared/game";
import { useSpell, useSpells, useSpellSummary } from "@/lib/game-data";
import { useSpellSearch } from "@/lib/query/services";

import { ByIdDemo } from "./by-id-demo";
import { IdsListDemo, SearchTableDemo } from "./demo-helpers";
import { useEntityColumns } from "./use-entity-columns";

export function UseSpellDemo() {
  return (
    <ByIdDemo
      useResult={useSpell}
      defaultId={DEFAULT_SPELL_ID}
      render={(id) => <GameSpell id={id} size="md" />}
    />
  );
}

export function UseSpellsDemo() {
  const columns = useEntityColumns();

  return (
    <IdsListDemo
      useResult={useSpells}
      columns={columns.spell}
      defaultIds={SAMPLE_SPELL_IDS}
      title="useSpells"
    />
  );
}

export function UseSpellSearchDemo() {
  const columns = useEntityColumns();

  return (
    <SearchTableDemo
      useSearch={useSpellSearch}
      columns={columns.spell}
      defaultQuery="Fireball"
      title="useSpellSearch"
    />
  );
}

export function UseSpellSummaryDemo() {
  return (
    <ByIdDemo
      useResult={useSpellSummary}
      defaultId={DEFAULT_SPELL_ID}
      render={(id) => <GameSpell id={id} size="md" />}
    />
  );
}
