"use client";

import { useIntlayer } from "next-intlayer";

import type { EngineEntry } from "@/lib/query/services";
import type {
  ItemSearchResult,
  SpellSearchResult,
} from "@wowlab/shared/lib/supabase/types";

import { GameItem } from "@/components/shared/game/game-item";
import { GameSpell } from "@/components/shared/game/game-spell";
import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  CommandGroup,
  CommandItem,
} from "@wowlab/shared/components/ui/command";
import {
  makeInspectItemUrl,
  makeInspectSpellUrl,
} from "@wowlab/shared/lib/links";

type SearchGameResultsProps = {
  engineMatches: EngineEntry[];
  isItemsVisible: boolean;
  isSearchAllEnabled: boolean;
  isSpellsVisible: boolean;
  itemResults: ItemSearchResult[];
  moreSpellResults: SpellSearchResult[];
  onSelect: (path: string) => void;
  categoryLabels: {
    Items: string;
    Spells: string;
  };
};

export function SearchGameResults({
  categoryLabels,
  engineMatches,
  isItemsVisible,
  isSearchAllEnabled,
  isSpellsVisible,
  itemResults,
  moreSpellResults,
  onSelect,
}: Readonly<SearchGameResultsProps>) {
  const content = useIntlayer("search");

  return (
    <>
      {isSpellsVisible && engineMatches.length > 0 ? (
        <CommandGroup heading={categoryLabels.Spells}>
          {engineMatches.map((entry) => (
            <CommandItem
              className="gap-2.5"
              key={`engine:${entry.type}:${entry.id}`}
              onSelect={() => onSelect(makeInspectSpellUrl(entry.id))}
              value={`engine:${entry.type}:${entry.id}`}
            >
              <GameSpell id={entry.id} size="sm" />
              <Badge className="shrink-0 text-[10px]" variant="secondary">
                {entry.spec_name}
              </Badge>
            </CommandItem>
          ))}
        </CommandGroup>
      ) : null}

      {isSearchAllEnabled && isSpellsVisible && moreSpellResults.length > 0 ? (
        <CommandGroup heading={content.moreSpells.value}>
          {moreSpellResults.map((spell) => (
            <CommandItem
              className="gap-2.5"
              key={`spell:${spell.id}`}
              onSelect={() => onSelect(makeInspectSpellUrl(spell.id))}
              value={`spell:${spell.id}`}
            >
              <GameSpell id={spell.id} size="sm" />
            </CommandItem>
          ))}
        </CommandGroup>
      ) : null}

      {isSearchAllEnabled && isItemsVisible && itemResults.length > 0 ? (
        <CommandGroup heading={categoryLabels.Items}>
          {itemResults.map((item) => (
            <CommandItem
              className="gap-2.5"
              key={`item:${item.id}`}
              onSelect={() => onSelect(makeInspectItemUrl(item.id))}
              value={`item:${item.id}`}
            >
              <GameItem id={item.id} size="sm" />
            </CommandItem>
          ))}
        </CommandGroup>
      ) : null}
    </>
  );
}
