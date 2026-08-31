import type {
  SimItem,
  SlotState,
} from "@/components/core/simulate/mock-bags/mock-data";

export function buildInitialSlots(
  simItems: Map<string, SimItem[]>,
): SlotState[] {
  return [...simItems.entries()]
    .filter(([, items]) => items.length > 1)
    .map(([slot, items]) => ({
      isLocked: false,
      items: items.map((si) => ({
        avgDps: 0,
        isEliminated: false,
        isPickedInBest: false,
        itemId: si.id,
        likelihood: 1 / items.length,
        likelihoodHistory: [],
        peakDps: 0,
        source: si.source,
      })),
      leadChanges: 0,
      leaderId: null,
      slot,
      stabilityStreak: 0,
    }));
}
