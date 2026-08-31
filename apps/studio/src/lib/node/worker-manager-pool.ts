import * as Comlink from "comlink";

import type { WorkerMetrics } from "./worker-metrics";
import type { WorkerSlot } from "./worker-slot";

import { getBulkBuffer } from "./game-data-provider";
import { getAutoWorkerCount } from "./parallelism";
import { attachWorkerDiagnostics } from "./worker-diagnostics";
import { createWorkerSlot } from "./worker-slot";

export type PoolDiagnosticWiring = {
  isTracked: (slot: WorkerSlot) => boolean;
  onFatal: (message: string, cause?: unknown) => void;
  onSlotError: (slot: WorkerSlot) => void;
};

export function createWorkerPoolSlots(
  maxWorkers: number,
  watchdogMs: number,
  wiring: PoolDiagnosticWiring,
): WorkerSlot[] {
  const desiredWorkers = getAutoWorkerCount(maxWorkers);

  return Array.from({ length: desiredWorkers }, (_, index) => {
    const slot = createWorkerSlot(index, watchdogMs);

    attachWorkerDiagnostics(slot, wiring);

    return slot;
  });
}

export async function initWorkerPool(
  slots: WorkerSlot[],
  engineWasm: ArrayBuffer,
  commonWasm: ArrayBuffer,
  ingest: (slot: WorkerSlot, metrics: WorkerMetrics) => void,
): Promise<void> {
  const bulkBuffer = await getBulkBuffer();

  await Promise.all(
    slots.map(async (slot) => {
      const engineCopy = engineWasm.slice(0);
      const commonCopy = commonWasm.slice(0);

      await slot.api.init(
        Comlink.transfer(engineCopy, [engineCopy]),
        Comlink.transfer(commonCopy, [commonCopy]),
      );

      const bufferCopy = bulkBuffer.slice(0);

      await slot.api.prime(Comlink.transfer(bufferCopy, [bufferCopy]));
      const metrics = await slot.api.getMetrics();

      ingest(slot, metrics);
    }),
  );
}
