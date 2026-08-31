"use client";

import type { RefObject } from "react";

import { useMemoizedFn } from "ahooks";
import { useRef, useState } from "react";

import {
  createSimEngine,
  type ItemState,
  type Permutation,
  type SimItem,
  type SlotState,
} from "@/components/core/simulate/mock-bags/mock-data";
import {
  type BestSet,
  type SimPhase,
} from "@/components/core/simulate/mock-bags/source-badge";
import {
  ELIMINATION_THRESHOLD,
  LOCK_THRESHOLD,
  PERMS_PER_CHUNK,
  TOP_N_FRACTION,
  TOTAL_CHUNKS,
} from "@/lib/sim/mock-bags-config";
import { buildInitialSlots } from "@/lib/sim/mock-slots";

type ItemStats = {
  itemDpsCount: Map<number, number>;
  itemDpsSum: Map<number, number>;
  itemPeakDps: Map<number, number>;
  itemTopCount: Map<number, number>;
};

export function useMockSimulationEngine(simItems: Map<string, SimItem[]>) {
  const [phase, setPhase] = useState<SimPhase>("idle");
  const [simSlots, setSimSlots] = useState<SlotState[]>([]);
  const [chunk, setChunk] = useState(0);
  const [permsSimmed, setPermsSimmed] = useState(0);
  const [simsPerSec, setSimsPerSec] = useState(0);
  const [bestPermDps, setBestPermDps] = useState(0);
  const [bestSet, setBestSet] = useState<BestSet>({});
  const [dpsHistory, setDpsHistory] = useState<
    { chunk: number; dps: number }[]
  >([]);
  const [flashSlots, setFlashSlots] = useState<Set<string>>(() => new Set());
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const cancelRef = useRef(false);

  const resetSim = useMemoizedFn(() => {
    cancelRef.current = true;
    setPhase("idle");
    setSimSlots(buildInitialSlots(simItems));
    setChunk(0);
    setPermsSimmed(0);
    setSimsPerSec(0);
    setBestPermDps(0);
    setBestSet({});
    setDpsHistory([]);
    setFlashSlots(new Set());
    setExpandedSlot(null);
  });

  const sleep = useMemoizedFn(
    (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      }),
  );

  const startSim = useMemoizedFn(async () => {
    cancelRef.current = false;
    setPhase("running");
    setSimSlots(buildInitialSlots(simItems));
    setChunk(0);
    setPermsSimmed(0);
    setSimsPerSec(0);
    setBestPermDps(0);
    setBestSet({});
    setDpsHistory([]);
    setFlashSlots(new Set());

    const engine = createSimEngine(simItems);
    const allPerms: Permutation[] = [];

    for (let c = 0; c < TOTAL_CHUNKS; c++) {
      if (isCancelled(cancelRef)) {
        return;
      }

      const batch = engine.generateBatch(PERMS_PER_CHUNK);

      allPerms.push(...batch);
      allPerms.sort((a, b) => b.dps - a.dps);
      const topCount = Math.max(
        1,
        Math.floor(allPerms.length * TOP_N_FRACTION),
      );
      const topPerms = allPerms.slice(0, topCount);
      const bestPerm = allPerms[0];
      const stats = aggregateItemStats(allPerms, topPerms, engine.slots);

      const newFlashes = new Set<string>();

      setSimSlots((prev) =>
        prev.map((slotState) => {
          const updated = computeUpdatedSlot(
            slotState,
            stats,
            topCount,
            c,
            bestPerm,
          );

          if (updated.leaderChanged) {
            newFlashes.add(slotState.slot);
          }

          return updated.slotState;
        }),
      );

      if (newFlashes.size > 0) {
        setFlashSlots(newFlashes);
        setTimeout(() => setFlashSlots(new Set()), 600);
      }

      setBestSet(bestPerm.picks);
      setBestPermDps(bestPerm.dps);
      setDpsHistory((prev) => [...prev, { chunk: c + 1, dps: bestPerm.dps }]);
      setChunk(c + 1);
      setPermsSimmed((c + 1) * PERMS_PER_CHUNK);
      setSimsPerSec(Math.round(2000 + Math.random() * 3000 + c * 400));

      const delay = 800 - c * 25 + Math.random() * 200;

      await sleep(Math.max(250, delay));
    }

    setPhase("complete");
  });

  const toggleExpandedSlot = useMemoizedFn((slot: string) => {
    setExpandedSlot((p) => (p === slot ? null : slot));
  });

  return {
    bestPermDps,
    bestSet,
    chunk,
    dpsHistory,
    expandedSlot,
    flashSlots,
    permsSimmed,
    phase,
    resetSim,
    simSlots,
    simsPerSec,
    startSim,
    toggleExpandedSlot,
  };
}

function aggregateItemStats(
  allPerms: Permutation[],
  topPerms: Permutation[],
  slots: string[],
): ItemStats {
  const itemTopCount = new Map<number, number>();
  const itemDpsSum = new Map<number, number>();
  const itemDpsCount = new Map<number, number>();
  const itemPeakDps = new Map<number, number>();

  for (const perm of allPerms) {
    for (const slot of slots) {
      const itemId = perm.picks[slot];

      itemDpsSum.set(itemId, (itemDpsSum.get(itemId) ?? 0) + perm.dps);
      itemDpsCount.set(itemId, (itemDpsCount.get(itemId) ?? 0) + 1);
      const prev = itemPeakDps.get(itemId) ?? 0;

      if (perm.dps > prev) {
        itemPeakDps.set(itemId, perm.dps);
      }
    }
  }

  for (const perm of topPerms) {
    for (const slot of slots) {
      const itemId = perm.picks[slot];

      itemTopCount.set(itemId, (itemTopCount.get(itemId) ?? 0) + 1);
    }
  }

  return { itemDpsCount, itemDpsSum, itemPeakDps, itemTopCount };
}

function computeUpdatedSlot(
  slotState: SlotState,
  stats: ItemStats,
  topCount: number,
  chunkIndex: number,
  bestPerm: Permutation,
): { leaderChanged: boolean; slotState: SlotState } {
  const updatedItems = slotState.items.map((is) =>
    updateSlotItem(
      is,
      stats,
      topCount,
      chunkIndex,
      bestPerm.picks[slotState.slot] === is.itemId,
    ),
  );

  const sorted = [...updatedItems].sort((a, b) => b.likelihood - a.likelihood);
  const newLeaderId = sorted[0]?.itemId ?? null;
  const leaderChanged =
    slotState.leaderId !== null && newLeaderId !== slotState.leaderId;
  const newStreak = leaderChanged ? 1 : slotState.stabilityStreak + 1;

  return {
    leaderChanged,
    slotState: {
      ...slotState,
      isLocked: newStreak >= LOCK_THRESHOLD,
      items: updatedItems,
      leadChanges: slotState.leadChanges + (leaderChanged ? 1 : 0),
      leaderId: newLeaderId,
      stabilityStreak: newStreak,
    },
  };
}

function isCancelled(cancelRef: RefObject<boolean>): boolean {
  return cancelRef.current;
}

function updateSlotItem(
  is: ItemState,
  stats: ItemStats,
  topCount: number,
  chunkIndex: number,
  isPickedInBest: boolean,
): ItemState {
  const appearances = stats.itemTopCount.get(is.itemId) ?? 0;
  const likelihood = appearances / topCount;
  const dpsSum = stats.itemDpsSum.get(is.itemId) ?? 0;
  const dpsCount = stats.itemDpsCount.get(is.itemId) ?? 1;
  const avgDps = Math.round(dpsSum / dpsCount);
  const peakDps = stats.itemPeakDps.get(is.itemId) ?? 0;

  return {
    ...is,
    avgDps,
    isEliminated: likelihood < ELIMINATION_THRESHOLD && chunkIndex > 2,
    isPickedInBest,
    likelihood,
    likelihoodHistory: [...is.likelihoodHistory, likelihood],
    peakDps,
  };
}
