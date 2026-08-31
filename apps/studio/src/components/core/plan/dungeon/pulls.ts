import type { FloorPack } from "@/lib/zod";

import { PULL_PALETTE } from "./palette";

export function buildPullsFromGroups(
  packs: ReadonlyArray<FloorPack>,
): ReadonlyArray<{
  index: number;
  packIds: ReadonlyArray<number>;
}> {
  const byGroup = new Map<number, number[]>();

  for (const pack of packs) {
    if (typeof pack.group !== "number") {
      continue;
    }

    const list = byGroup.get(pack.group) ?? [];

    list.push(pack.id);
    byGroup.set(pack.group, list);
  }

  return [...byGroup.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, packIds], idx) => ({ index: idx + 1, packIds }));
}

export function colorForPull(index: number): string {
  return PULL_PALETTE[(index - 1) % PULL_PALETTE.length];
}

export function isFocused(
  focusedPullIndex: number | undefined,
  pullIndex: number | undefined,
): boolean {
  return focusedPullIndex === undefined || focusedPullIndex === pullIndex;
}
