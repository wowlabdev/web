"use client";

import type { Profile } from "wowlab-common";

import { useCreation } from "ahooks";

import { useItemSummaries } from "@/lib/game-data";

export function useAverageItemLevel(profile: Profile | null): number | null {
  const itemIds = useCreation(
    () => profile?.equipment.map((item) => item.id) ?? [],
    [profile],
  );
  const { data: items } = useItemSummaries(itemIds);

  return useCreation(() => {
    if (!items || items.length === 0) {
      return null;
    }

    const total = items.reduce((sum, item) => sum + item.item_level, 0);

    return Math.round(total / items.length);
  }, [items]);
}
