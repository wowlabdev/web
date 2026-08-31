"use client";

import type { GearSlot, Item, Profile } from "wowlab-common";

import { useCreation } from "ahooks";

import type { SimItem } from "@/components/core/simulate/mock-bags/mock-data";

import { SLOT_ORDER } from "@/lib/sim/slots";

export type SlotGroup = {
  bag: Item[];
  equipped: Item | null;
  weekly: Item[];
};

export function useSlotGrouping(profile: Profile | null) {
  const slotGroups = useCreation(() => {
    const groups = new Map<GearSlot, SlotGroup>();

    if (!profile) {
      return groups;
    }

    for (const slot of SLOT_ORDER) {
      groups.set(slot, { bag: [], equipped: null, weekly: [] });
    }

    for (const item of profile.equipment) {
      const g = groups.get(item.slot);

      if (g) {
        g.equipped = item;
      }
    }

    for (const item of profile.bagItems) {
      const g = groups.get(item.slot);

      if (g) {
        g.bag.push(item);
      }
    }

    for (const item of profile.weeklyRewards) {
      const g = groups.get(item.slot);

      if (g) {
        g.weekly.push(item);
      }
    }

    return groups;
  }, [profile]);

  const simItems = useCreation(() => {
    const map = new Map<string, SimItem[]>();

    if (!profile) {
      return map;
    }

    for (const item of profile.equipment) {
      const list = map.get(item.slot) ?? [];

      list.push({ id: item.id, source: "equipped" });
      map.set(item.slot, list);
    }

    for (const item of profile.bagItems) {
      const list = map.get(item.slot) ?? [];

      list.push({ id: item.id, source: "bag" });
      map.set(item.slot, list);
    }

    for (const item of profile.weeklyRewards) {
      const list = map.get(item.slot) ?? [];

      list.push({ id: item.id, source: "weekly" });
      map.set(item.slot, list);
    }

    return map;
  }, [profile]);

  return { simItems, slotGroups };
}
