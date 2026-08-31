"use client";

import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer";

import type { ClassRow, JournalInstance, SpecRow } from "@/lib/game-data";
import type { Item, Spell } from "@wowlab/shared/lib/supabase/types";

import { GameItem, GameSpec, GameSpell } from "@/components/shared/game";
import { QUALITY_LABELS } from "@/lib/game/quality";
import { Badge } from "@wowlab/shared/components/ui/badge";

export type ClassLike = Pick<ClassRow, "color" | "id" | "name">;

export type Column<T> = {
  cell: (row: T) => ReactNode;
  header: string;
};
export type ItemLike = Pick<Item, "id" | "item_level" | "name" | "quality">;
export type JournalLike = Pick<JournalInstance, "id" | "name">;
export type SpecLike = Pick<SpecRow, "class_name" | "id" | "name" | "role">;
export type SpellLike = Pick<Spell, "id" | "name">;

export function useEntityColumns() {
  const content = useIntlayer("hooksPage");
  const game = useIntlayer("sharedGame");

  const classColumns: Column<ClassLike>[] = [
    {
      cell: (row) => <span style={{ color: row.color }}>{row.name}</span>,
      header: content.class.value,
    },
    {
      cell: (row) => (
        <span className="text-muted-foreground font-mono text-xs">
          {row.id}
        </span>
      ),
      header: content.columnId.value,
    },
  ];

  const journalColumns: Column<JournalLike>[] = [
    { cell: (row) => <span>{row.name}</span>, header: content.name.value },
    {
      cell: (row) => (
        <span className="text-muted-foreground font-mono text-xs">
          {row.id}
        </span>
      ),
      header: content.columnId.value,
    },
  ];

  const itemColumns: Column<ItemLike>[] = [
    { cell: (row) => <GameItem id={row.id} />, header: content.item.value },
    {
      cell: (row) => <Badge variant="outline">{row.item_level}</Badge>,
      header: content.level.value,
    },
    {
      cell: (row) => (
        <Badge variant="secondary">
          {QUALITY_LABELS[row.quality] ?? game.unknown.value}
        </Badge>
      ),
      header: content.quality.value,
    },
  ];

  const specColumns: Column<SpecLike>[] = [
    { cell: (row) => <GameSpec specId={row.id} />, header: content.spec.value },
    {
      cell: (row) => <span>{row.class_name}</span>,
      header: content.class.value,
    },
    {
      cell: (row) => <Badge variant="outline">{row.role}</Badge>,
      header: content.role.value,
    },
  ];

  const spellColumns: Column<SpellLike>[] = [
    {
      cell: (row) => <GameSpell id={row.id} />,
      header: content.columnSpell.value,
    },
    {
      cell: (row) => (
        <span className="text-muted-foreground font-mono text-xs">
          {row.id}
        </span>
      ),
      header: content.columnId.value,
    },
  ];

  return {
    class: classColumns,
    item: itemColumns,
    journal: journalColumns,
    spec: specColumns,
    spell: spellColumns,
  };
}
