"use client";

import { useMemoizedFn } from "ahooks";
import { useMemo, useState } from "react";

import { useJournalList } from "@/lib/game-data";
import {
  getJournalDifficultyKeys,
  type LootSourceKind,
} from "@/lib/game/difficulty-bonus";
import {
  type JournalExportLootTarget,
  useJournalExportLoot,
} from "@/lib/query/services/game";

import type { DifficultyChecklistGroup } from "./difficulty-checklist";
import type { JournalEncounter, JournalSource } from "./types";

import { toJournalSource } from "./data-mappers";
import { encounterKey } from "./export-menu-helpers";
import { buildLootModelFiles } from "./export-serialization";

type UseExportMenuArgs = {
  selectedEncounter: JournalEncounter;
  selectedSource: JournalSource;
};

export function useExportMenu({
  selectedEncounter,
  selectedSource,
}: UseExportMenuArgs) {
  const [open, setOpen] = useState(false);
  const [selectedDifficultyKeys, setSelectedDifficultyKeys] = useState<
    Set<string>
  >(() => new Set());
  const [selectedEncounterKeys, setSelectedEncounterKeys] = useState<
    Set<string>
  >(() => new Set());

  // Loot is fetched only for the prepared snapshot (committed via "Prepare data"), not on every selection change.
  const [preparedTargets, setPreparedTargets] = useState<
    JournalExportLootTarget[]
  >([]);
  const [preparedSources, setPreparedSources] = useState<JournalSource[]>([]);

  const { data: raidInstances = [] } = useJournalList("raid");
  const { data: dungeonInstances = [] } = useJournalList("dungeon");

  const sources = useMemo<JournalSource[]>(
    () =>
      [...raidInstances, ...dungeonInstances].map((instance) =>
        toJournalSource(instance),
      ),
    [raidInstances, dungeonInstances],
  );

  const difficultyGroups = useMemo<DifficultyChecklistGroup[]>(() => {
    const sourceKinds: LootSourceKind[] = ["raid", "dungeon"];

    return sourceKinds.map((sourceKind) => {
      const sameKind = sources.filter((source) => source.kind === sourceKind);
      const isMythicPlus = sameKind.some((source) => source.isMythicPlus);

      return {
        difficultyKeys: getJournalDifficultyKeys({
          difficulty: "all",
          isMythicPlus,
          sourceKind,
        }),
        sourceKind,
      };
    });
  }, [sources]);

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setSelectedDifficultyKeys(
        new Set(
          getJournalDifficultyKeys({
            difficulty: "all",
            isMythicPlus: selectedSource.isMythicPlus,
            sourceKind: selectedSource.kind,
          }),
        ),
      );
      setSelectedEncounterKeys(
        new Set([
          encounterKey(selectedSource.instanceId, selectedEncounter.id),
        ]),
      );
      setPreparedTargets([]);
      setPreparedSources([]);
    }

    setOpen(nextOpen);
  }

  const selectedSources = useMemo(
    () =>
      sources
        .map((source) => ({
          ...source,
          encounters: source.encounters.filter((encounter) =>
            selectedEncounterKeys.has(
              encounterKey(source.instanceId, encounter.id),
            ),
          ),
        }))
        .filter((source) => source.encounters.length > 0),
    [selectedEncounterKeys, sources],
  );

  const targets = useMemo(
    () =>
      selectedSources.flatMap((source) =>
        source.encounters.map((encounter) => ({
          encounterId: encounter.id,
          instanceId: source.instanceId,
          isMythicPlus: source.isMythicPlus,
          sourceKind: source.kind,
        })),
      ),
    [selectedSources],
  );

  const { data: exportLoot = [], isFetching } =
    useJournalExportLoot(preparedTargets);
  const files = buildLootModelFiles({
    difficultyKeys: selectedDifficultyKeys,
    loot: exportLoot,
    sources: preparedSources,
  });
  const lua = files.map((file) => file.lua).join("\n\n");

  // "Prepared" tracks encounter selection only; difficulty toggles re-filter fetched loot client-side without a re-fetch.
  const targetsKey = targets
    .map((target) => `${target.instanceId}:${target.encounterId}`)
    .sort((a, b) => a.localeCompare(b))
    .join(",");
  const preparedKey = preparedTargets
    .map((target) => `${target.instanceId}:${target.encounterId}`)
    .sort((a, b) => a.localeCompare(b))
    .join(",");
  const isStale = preparedTargets.length > 0 && targetsKey !== preparedKey;

  const handlePrepare = useMemoizedFn(() => {
    setPreparedTargets(targets);
    setPreparedSources(selectedSources);
  });

  const selectionSummary = useMemo(
    () => ({
      encounters: selectedSources.reduce(
        (sum, source) => sum + source.encounters.length,
        0,
      ),
      instances: selectedSources.length,
    }),
    [selectedSources],
  );

  function handleDifficultyToggle(difficultyKey: string, checked: boolean) {
    setSelectedDifficultyKeys((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(difficultyKey);
      } else {
        next.delete(difficultyKey);
      }

      return next;
    });
  }

  return {
    difficultyGroups,
    files,
    handleDifficultyToggle,
    handleOpenChange,
    handlePrepare,
    isFetching,
    isStale,
    lua,
    open,
    selectedDifficultyKeys,
    selectedEncounterKeys,
    selectionSummary,
    setSelectedDifficultyKeys,
    setSelectedEncounterKeys,
    sources,
    targets,
  };
}
