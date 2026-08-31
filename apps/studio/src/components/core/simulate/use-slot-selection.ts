"use client";

import type { GearSlot, PermutationSpace, Profile } from "wowlab-common";

import { useBoolean, useCreation, useMemoizedFn } from "ahooks";
import { useState } from "react";

import type { InventoryRow } from "@/components/core/simulate/inventory-slot-table";
import type { SlotGroup } from "@/components/core/simulate/use-slot-grouping";

import { useCommon } from "@/components/shared/wasm";

export function useSlotSelection(
  profile: Profile | null,
  slotGroups: Map<GearSlot, SlotGroup>,
) {
  const common = useCommon();
  const [shouldIncludeWeekly, { set: setIncludeWeekly }] = useBoolean(true);
  const [selectedItems, setSelectedItems] = useState<
    Partial<Record<string, Set<number>>>
  >({});

  const getSlotItems = useMemoizedFn((slot: GearSlot): InventoryRow[] => {
    const group = slotGroups.get(slot);

    if (!group) {
      return [];
    }

    const items = [
      ...group.bag.map((item, i) => ({
        index: i,
        item,
        source: "bag" as const,
      })),
      ...(shouldIncludeWeekly
        ? group.weekly.map((item, i) => ({
            index: group.bag.length + i,
            item,
            source: "weekly" as const,
          }))
        : []),
    ];

    return items.map((entry) => ({
      ...entry,
      isSelected: selectedItems[slot]?.has(entry.index) ?? false,
    }));
  });

  const space = useCreation<PermutationSpace | null>(() => {
    if (!profile) {
      return null;
    }

    const selections = Object.fromEntries(
      Object.entries(selectedItems)
        .filter(([, set]) => set && set.size > 0)
        .map(([slot, set]) => [slot, [...(set ?? [])]]),
    );

    return common.buildSpaceForSelection(
      profile,
      selections,
    ) as PermutationSpace;
  }, [profile, selectedItems, common]);

  const combinationCount = space ? Number(space.total) : 1;
  const selectedCount = Object.values(selectedItems).reduce(
    (sum, set) => sum + (set?.size ?? 0),
    0,
  );

  const toggleItem = useMemoizedFn((slot: string, index: number) => {
    setSelectedItems((prev) => {
      const set = new Set(prev[slot]);

      if (set.has(index)) {
        set.delete(index);
      } else {
        set.add(index);
      }

      return { ...prev, [slot]: set };
    });
  });

  const selectAll = useMemoizedFn(() => {
    const next: Record<string, Set<number>> = {};

    for (const [slot, group] of slotGroups) {
      const count =
        group.bag.length + (shouldIncludeWeekly ? group.weekly.length : 0);

      next[slot] = new Set(Array.from({ length: count }, (_, i) => i));
    }

    setSelectedItems(next);
  });

  const deselectAll = useMemoizedFn(() => setSelectedItems({}));

  const hasInventory =
    !!profile &&
    (profile.bagItems.length > 0 || profile.weeklyRewards.length > 0);
  const weeklyAvailable = shouldIncludeWeekly
    ? (profile?.weeklyRewards.length ?? 0)
    : 0;
  const totalAvailable = profile
    ? profile.bagItems.length + weeklyAvailable
    : 0;

  return {
    combinationCount,
    deselectAll,
    getSlotItems,
    hasInventory,
    selectAll,
    selectedCount,
    selectedItems,
    setIncludeWeekly,
    shouldIncludeWeekly,
    space,
    toggleItem,
    totalAvailable,
  };
}
