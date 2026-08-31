import type { PermutationSpace, SlotCandidates } from "wowlab-common";

export function contestedSlots(space: PermutationSpace): SlotCandidates[] {
  return space.contestedIndices.map((i) => space.slots[i]);
}

export function itemsQuery(ids: number[]): string {
  return `query({ table: "game.items", filters: [{ column: "id", op: "in", value: [${ids.join(", ")}] }] })`;
}

export function slotItemIds(sc: SlotCandidates): number[] {
  return sc.candidates.map((c) => c.item.id);
}
