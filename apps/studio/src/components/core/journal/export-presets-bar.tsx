"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import type { LootSourceKind } from "@/lib/game/difficulty-bonus";

import { Button } from "@wowlab/shared/components/ui/button";

import type { DifficultyChecklistGroup } from "./difficulty-checklist";
import type { JournalEncounter, JournalSource } from "./types";

import { encounterKey, getAllEncounterKeys } from "./export-menu-helpers";

type ExportPresetsBarProps = {
  difficultyGroups: DifficultyChecklistGroup[];
  selectedEncounter: JournalEncounter;
  selectedSource: JournalSource;
  selectionSummary: { encounters: number; instances: number };
  sources: JournalSource[];
  onSelectDifficultyKeys: (keys: Set<string>) => void;
  onSelectEncounterKeys: (keys: Set<string>) => void;
};

type PresetButton = {
  isDisabled?: boolean;
  key: string;
  label: string;
  onClick: () => void;
};

export function ExportPresetsBar({
  difficultyGroups,
  onSelectDifficultyKeys,
  onSelectEncounterKeys,
  selectedEncounter,
  selectedSource,
  selectionSummary,
  sources,
}: Readonly<ExportPresetsBarProps>) {
  const content = useIntlayer("journalPage");

  function difficultyKeysForKinds(kinds: Iterable<LootSourceKind>) {
    const next = new Set<string>();
    const seenKinds = new Set(kinds);

    for (const group of difficultyGroups) {
      if (!seenKinds.has(group.sourceKind)) {
        continue;
      }

      for (const difficultyKey of group.difficultyKeys) {
        next.add(difficultyKey);
      }
    }

    return next;
  }

  function selectScope(scope: {
    encounters: string[];
    kinds: Iterable<LootSourceKind>;
  }) {
    onSelectEncounterKeys(new Set(scope.encounters));
    onSelectDifficultyKeys(difficultyKeysForKinds(scope.kinds));
  }

  const currentSeasonSources = useMemo(
    () => sources.filter((source) => source.isCurrentSeason),
    [sources],
  );
  const currentSeasonKinds = useMemo(
    () => new Set(currentSeasonSources.map((source) => source.kind)),
    [currentSeasonSources],
  );
  const allKinds = useMemo(
    () => new Set(sources.map((source) => source.kind)),
    [sources],
  );

  const presets: PresetButton[] = [
    {
      key: "encounter",
      label: content.exportCurrentEncounter.value,
      onClick: () =>
        selectScope({
          encounters: [
            encounterKey(selectedSource.instanceId, selectedEncounter.id),
          ],
          kinds: [selectedSource.kind],
        }),
    },
    {
      key: "instance",
      label: content.exportCurrentInstance.value,
      onClick: () =>
        selectScope({
          encounters: getAllEncounterKeys([selectedSource]),
          kinds: [selectedSource.kind],
        }),
    },
    {
      isDisabled: currentSeasonSources.length === 0,
      key: "season",
      label: content.exportCurrentSeason.value,
      onClick: () =>
        selectScope({
          encounters: getAllEncounterKeys(currentSeasonSources),
          kinds: currentSeasonKinds,
        }),
    },
    {
      key: "all",
      label: content.exportSelectAll.value,
      onClick: () =>
        selectScope({
          encounters: getAllEncounterKeys(sources),
          kinds: allKinds,
        }),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 border bg-muted/20 p-2">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {content.exportPresetsLabel}
      </span>
      {presets.map((preset) => (
        <Button
          key={preset.key}
          disabled={preset.isDisabled}
          size="xs"
          variant="outline"
          onClick={preset.onClick}
        >
          {preset.label}
        </Button>
      ))}
      <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
        {
          content.exportSelectionSummary({
            encounters: selectionSummary.encounters,
            instances: selectionSummary.instances,
          }).value
        }
      </span>
    </div>
  );
}
