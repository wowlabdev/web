"use client";

import { useState } from "react";

import type { ObjectId } from "@/components/shared/canvas";

export type TalentSelectionState = {
  selectedNodeIds: ReadonlySet<number>;
};

export function useTalentSelection() {
  const [selectedId, setSelectedId] = useState<ObjectId | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  const toggleNode = (rawId: number) => {
    setSelectedNodeIds((prev) => {
      const next = new Set(prev);

      if (next.has(rawId)) {
        next.delete(rawId);
      } else {
        next.add(rawId);
      }

      return next;
    });
  };

  return {
    selectedId,
    selectedNodeIds,
    setSelectedId,
    toggleNode,
  };
}
