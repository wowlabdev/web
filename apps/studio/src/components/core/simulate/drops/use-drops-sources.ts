"use client";

import { useCreation, useMemoizedFn } from "ahooks";
import { useState } from "react";

import {
  DEFAULT_DIFFICULTY,
  DEFAULT_SOURCE_CATALOG,
  type Difficulty,
  getInstancesByCategory,
  type SourceCategory,
  type SourceId,
} from "@/lib/sim/sources";

export type DropsSourcesState = ReturnType<typeof useDropsSources>;

export type SourceInstanceRow = {
  id: SourceId;
  isSelected: boolean;
  label: string;
};

export function useDropsSources() {
  const [selectedCategories, setSelectedCategories] = useState<
    Set<SourceCategory>
  >(() => new Set());
  const [selectedSources, setSelectedSources] = useState<
    Partial<Record<string, Set<SourceId>>>
  >({});
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  const [keyLevel, setKeyLevel] = useState(10);

  const toggleCategory = useMemoizedFn((category: SourceCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);

      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }

      return next;
    });
  });

  const toggleSource = useMemoizedFn((category: string, sourceId: SourceId) => {
    setSelectedSources((prev) => {
      const set = new Set(prev[category]);

      if (set.has(sourceId)) {
        set.delete(sourceId);
      } else {
        set.add(sourceId);
      }

      return { ...prev, [category]: set };
    });
  });

  const getInstanceRows = useMemoizedFn(
    (category: SourceCategory): SourceInstanceRow[] => {
      const instances = getInstancesByCategory(
        DEFAULT_SOURCE_CATALOG,
        category,
      );

      return instances.map((inst) => ({
        id: inst.id,
        isSelected: selectedSources[category]?.has(inst.id) ?? false,
        label: inst.label,
      }));
    },
  );

  const { categoryCount, sourceCount } = useCreation(() => {
    let sources = 0;

    for (const cat of selectedCategories) {
      sources += selectedSources[cat]?.size ?? 0;
    }

    return { categoryCount: selectedCategories.size, sourceCount: sources };
  }, [selectedCategories, selectedSources]);

  return {
    categoryCount,
    difficulty,
    getInstanceRows,
    keyLevel,
    selectedCategories,
    setDifficulty,
    setKeyLevel,
    sourceCount,
    toggleCategory,
    toggleSource,
  };
}
