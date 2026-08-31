import type { WorkerSlot } from "./worker-slot";

import { createWorkerMetrics, type WorkerMetrics } from "./worker-metrics";
import { sanitizeWorkerMetrics } from "./worker-metrics-aggregate";

export function buildSlotErrorMetrics(slot: WorkerSlot): WorkerMetrics {
  return createWorkerMetrics({
    currentChunkIndex: slot.lastMetrics.currentChunkIndex,
    currentIterations: slot.lastMetrics.currentIterations,
    currentJobId: slot.lastMetrics.currentJobId,
    currentPhase: slot.lastMetrics.currentPhase,
    isEnabled: slot.isEnabled,
    state: "error",
    workerId: slot.id,
  });
}

export function buildTerminatedSlotMetrics(slot: WorkerSlot): WorkerMetrics {
  return createWorkerMetrics({
    isEnabled: false,
    state: "terminated",
    workerId: slot.id,
  });
}

export function collectSlotMetrics(
  slots: WorkerSlot[],
): Promise<WorkerMetrics[]> {
  return Promise.all(
    slots.map(async (slot) => {
      try {
        const metrics = await slot.api.getMetrics();

        slot.lastMetrics = sanitizeWorkerMetrics(slot, metrics);

        return slot.lastMetrics;
      } catch {
        return slot.lastMetrics;
      }
    }),
  );
}
