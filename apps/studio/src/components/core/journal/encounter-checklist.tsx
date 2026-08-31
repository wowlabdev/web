"use client";

import { useIntlayer } from "next-intlayer";

import { Checkbox } from "@wowlab/shared/components/ui/checkbox";
import { ScrollArea } from "@wowlab/shared/components/ui/scroll-area";

import type { JournalSource } from "./types";

import { encounterKey, getTriState } from "./export-menu-helpers";

type EncounterChecklistProps = {
  selected: Set<string>;
  sources: JournalSource[];
  onSelect: (keys: Set<string>) => void;
};

export function EncounterChecklist({
  onSelect,
  selected,
  sources,
}: Readonly<EncounterChecklistProps>) {
  const content = useIntlayer("journalPage");

  function toggleKey(key: string, checked: boolean) {
    const next = new Set(selected);

    if (checked) {
      next.add(key);
    } else {
      next.delete(key);
    }

    onSelect(next);
  }

  function toggleSource(sourceKeys: string[], checked: boolean) {
    const next = new Set(selected);

    for (const key of sourceKeys) {
      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }
    }

    onSelect(next);
  }

  const renderSource = (source: JournalSource) => {
    const sourceKeys = source.encounters.map((encounter) =>
      encounterKey(source.instanceId, encounter.id),
    );
    const selectedCount = sourceKeys.filter((k) => selected.has(k)).length;

    return (
      <div key={source.id} className="border">
        <label className="flex items-center gap-2 border-b bg-muted/20 px-2 py-2">
          <Checkbox
            checked={getTriState(selectedCount, sourceKeys.length)}
            onCheckedChange={(checked) => toggleSource(sourceKeys, !!checked)}
          />
          <span className="truncate font-medium">{source.name}</span>
          {source.isCurrentSeason && (
            <span className="ml-auto shrink-0 border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
              {content.currentBadge}
            </span>
          )}
        </label>
        <div className="grid gap-1 p-2 sm:grid-cols-2">
          {source.encounters.map((encounter) => {
            const key = encounterKey(source.instanceId, encounter.id);

            return (
              <label
                key={key}
                className="flex min-w-0 items-center gap-2 text-xs"
              >
                <Checkbox
                  checked={selected.has(key)}
                  onCheckedChange={(checked) => toggleKey(key, !!checked)}
                />
                <span className="truncate">{encounter.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-0 space-y-3 border p-3">
      <div className="space-y-1">
        <p className="font-medium">{content.exportEncountersTitle}</p>
        <p className="text-[11px] text-muted-foreground">
          {content.exportEncountersHint}
        </p>
      </div>

      <ScrollArea className="max-h-80 pr-1">
        <div className="space-y-4">
          {(["raid", "dungeon"] as const).map((kind) => {
            const kindSources = sources.filter(
              (source) => source.kind === kind,
            );

            if (kindSources.length === 0) {
              return null;
            }

            return (
              <div key={kind} className="space-y-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {kind === "raid" ? content.tabRaids : content.tabDungeons}
                </p>
                {kindSources.map((source) => renderSource(source))}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
