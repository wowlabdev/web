export type ItemState = {
  avgDps: number;
  isEliminated: boolean;
  isPickedInBest: boolean;
  itemId: number;
  likelihood: number;
  likelihoodHistory: number[];
  peakDps: number;
  source: "bag" | "equipped" | "weekly";
};

export type Permutation = {
  dps: number;
  picks: Record<string, number>;
};

export type SimItem = {
  id: number;
  source: "bag" | "equipped" | "weekly";
};

export type SlotState = {
  isLocked: boolean;
  items: ItemState[];
  leadChanges: number;
  leaderId: number | null;
  slot: string;
  stabilityStreak: number;
};

export function createSimEngine(slotItems: Map<string, SimItem[]>) {
  const powers = new Map<number, number>();
  const slots = [...slotItems.keys()];

  for (const slot of slots) {
    const items = slotItems.get(slot) ?? [];
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    for (const [i, item] of shuffled.entries()) {
      const base = (shuffled.length - i) * 3000;
      const variance = (Math.random() - 0.5) * 1500;

      powers.set(item.id, base + variance);
    }
  }

  let batchIndex = 0;

  function generateBatch(count: number): Permutation[] {
    const batch: Permutation[] = [];
    const noiseScale = Math.max(2000, 12_000 - batchIndex * 500);

    for (let i = 0; i < count; i++) {
      const picks: Record<string, number> = {};
      let totalPower = 0;

      for (const slot of slots) {
        const items = slotItems.get(slot) ?? [];
        const pick = items[Math.floor(Math.random() * items.length)];

        picks[slot] = pick.id;
        totalPower += powers.get(pick.id) ?? 0;
      }

      const noise = (Math.random() - 0.5) * noiseScale;
      const dps = 150_000 + totalPower + noise;

      batch.push({ dps: Math.round(dps), picks });
    }

    batchIndex++;

    return batch;
  }

  return { generateBatch, powers, slots };
}

export function totalPermutations(slotItems: Map<string, SimItem[]>): number {
  let total = 1;

  for (const items of slotItems.values()) {
    if (items.length > 0) {
      total *= items.length;
    }
  }

  return total;
}
