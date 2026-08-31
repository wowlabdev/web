"use client";

import type { ReactNode } from "react";

import { useDebounce } from "ahooks";
import { Package, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { GameAura, GameItem, GameSpell } from "@/components/shared/game";
import { useEngineSearch } from "@/components/shared/search";
import { useItemSearch, useSpellSearch } from "@/lib/query/services";
import { SectionHeader } from "@wowlab/shared/components/common/section-header";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Input } from "@wowlab/shared/components/ui/input";
import {
  makeInspectItemUrl,
  makeInspectSpellUrl,
} from "@wowlab/shared/lib/links";
import { useLocalizedRouter } from "@wowlab/shared/lib/routing";
import { cn } from "@wowlab/shared/lib/utils";

type Category = "auras" | "items" | "spells";

type Hit = {
  key: string;
  node: ReactNode;
  path: string;
};

const CATEGORIES: { icon: typeof Search; key: Category; label: string }[] = [
  { icon: Sparkles, key: "spells", label: "Spells" },
  { icon: Sparkles, key: "auras", label: "Auras" },
  { icon: Package, key: "items", label: "Items" },
];

export function InspectIndexPage() {
  const router = useLocalizedRouter();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Set<Category>>(() => new Set());
  const debounced = useDebounce(query, { wait: 250 });
  const trimmed = debounced.trim();
  const hasQuery = trimmed.length > 0;

  const engineMatches = useEngineSearch(trimmed);
  const { data: spellData } = useSpellSearch(trimmed);
  const { data: itemData } = useItemSearch(trimmed);

  const spellHits = useMemo<Hit[]>(() => {
    const seen = new Set<number>();
    const hits: Hit[] = [];

    for (const entry of engineMatches) {
      if (entry.type === "spell" && !seen.has(entry.id)) {
        seen.add(entry.id);
        hits.push({
          key: `spell-${entry.id}`,
          node: <GameSpell id={entry.id} size="md" />,
          path: makeInspectSpellUrl(entry.id),
        });
      }
    }

    for (const spell of spellData ?? []) {
      if (!seen.has(spell.id)) {
        seen.add(spell.id);
        hits.push({
          key: `spell-${spell.id}`,
          node: <GameSpell id={spell.id} size="md" />,
          path: makeInspectSpellUrl(spell.id),
        });
      }
    }

    return hits;
  }, [engineMatches, spellData]);

  const auraHits = useMemo<Hit[]>(
    () =>
      engineMatches
        .filter((entry) => entry.type === "aura")
        .map((entry) => ({
          key: `aura-${entry.id}`,
          node: <GameAura spellId={entry.id} size="md" />,
          path: makeInspectSpellUrl(entry.id),
        })),
    [engineMatches],
  );

  const itemHits = useMemo<Hit[]>(
    () =>
      (itemData ?? []).map((item) => ({
        key: `item-${item.id}`,
        node: <GameItem id={item.id} size="md" />,
        path: makeInspectItemUrl(item.id),
      })),
    [itemData],
  );

  const sections: { hits: Hit[]; key: Category; title: string }[] = [
    { hits: spellHits, key: "spells", title: "Spells" },
    { hits: auraHits, key: "auras", title: "Auras" },
    { hits: itemHits, key: "items", title: "Items" },
  ];

  const showCategory = (key: Category) =>
    filters.size === 0 || filters.has(key);

  const visible = sections.filter(
    (section) => showCategory(section.key) && section.hits.length > 0,
  );

  function toggleFilter(key: Category) {
    setFilters((prev) => {
      const next = new Set(prev);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        align="left"
        title="Inspect game data"
        description="Search spells, auras, and items — then drill into the details."
      />

      <div className="space-y-3">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map(({ icon: Icon, key, label }) => {
            const active = filters.has(key);

            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleFilter(key)}
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center text-sm">
          {hasQuery
            ? `No matches for “${trimmed}”.`
            : "Start typing to search the game database."}
        </p>
      ) : (
        <div className="space-y-4">
          {visible.map((section) => (
            <TableCard
              key={section.key}
              title={`${section.title} (${section.hits.length})`}
              data={section.hits}
              rowKey={(hit) => hit.key}
              onRowClick={(hit) => router.push(hit.path)}
              columns={[{ cell: (hit) => hit.node, header: section.title }]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
