"use client";

import { useEffect, useMemo } from "react";

import type { DifficultyScope, JournalEncounter, JournalSource } from "./types";
import type { JournalQuery } from "./use-journal-query";

export function useJournalSelection(
  sources: JournalSource[],
  query: JournalQuery,
  setQuery: (updates: Partial<JournalQuery>) => void,
): {
  allowedDifficulties: DifficultyScope[];
  selectedEncounter: JournalEncounter | undefined;
  selectedSource: JournalSource | undefined;
} {
  const { difficulty, encounter: encounterId, instance: instanceId } = query;

  const selectedSource = useMemo(
    () =>
      sources.find((source) => source.id === instanceId) ??
      sources.find((source) => source.encounters.length > 0) ??
      sources.at(0),
    [instanceId, sources],
  );

  const selectedEncounter = useMemo(
    () =>
      selectedSource?.encounters.find(
        (encounter) => String(encounter.id) === encounterId,
      ) ?? selectedSource?.encounters.at(0),
    [encounterId, selectedSource],
  );

  const allowedDifficulties = useMemo<DifficultyScope[]>(
    () => ["all", ...(selectedSource?.difficulties ?? [])],
    [selectedSource?.difficulties],
  );

  useEffect(() => {
    if (!selectedSource) {
      return;
    }

    const encounterBelongsToSource = selectedSource.encounters.some(
      (encounter) => String(encounter.id) === encounterId,
    );

    if (selectedSource.id === instanceId && encounterBelongsToSource) {
      return;
    }

    const firstEncounter = selectedSource.encounters.at(0);
    const resolveEncounter = () => {
      if (encounterBelongsToSource) {
        return encounterId;
      }

      if (firstEncounter) {
        return String(firstEncounter.id);
      }

      return "";
    };

    setQuery({
      encounter: resolveEncounter(),
      instance: selectedSource.id,
    });
  }, [encounterId, instanceId, selectedSource, setQuery]);

  useEffect(() => {
    if (!allowedDifficulties.includes(difficulty)) {
      setQuery({ difficulty: "all" });
    }
  }, [allowedDifficulties, difficulty, setQuery]);

  return { allowedDifficulties, selectedEncounter, selectedSource };
}
