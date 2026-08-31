import * as Comlink from "comlink";

import type { SimWorkerApi } from "./sim-worker";
import type {
  NodeKeypair,
  WorkerChunkPayload,
  WorkerEnv,
  WorkerProgressHandler,
  WorkerRunResult,
} from "./worker-contract";
import type { WorkerMetrics } from "./worker-metrics";
import type { WatchdogTimeoutSnapshot } from "./worker-watchdog";

import { createWorkerMetrics } from "./worker-metrics";
import { WorkerWatchdog } from "./worker-watchdog";

export type PendingTask = {
  chunk: WorkerChunkPayload;
  env: WorkerEnv;
  keypair: NodeKeypair;
  onProgress?: WorkerProgressHandler;
  reject: (reason: unknown) => void;
  resolve: (result: WorkerRunResult) => void;
};

export type WorkerSlot = {
  activeTask: PendingTask | null;
  api: Comlink.Remote<SimWorkerApi>;
  id: string;
  isBusy: boolean;
  isEnabled: boolean;
  lastMetrics: WorkerMetrics;
  watchdog: WorkerWatchdog;
  worker: Worker;
};

export function createWorkerSlot(
  index: number,
  watchdogMs: number,
): WorkerSlot {
  const id = `w${index + 1}`;
  const worker = new Worker(new URL("sim-worker.ts", import.meta.url), {
    type: "module",
  });

  return {
    activeTask: null,
    api: Comlink.wrap<SimWorkerApi>(worker),
    id,
    isBusy: false,
    isEnabled: true,
    lastMetrics: createWorkerMetrics({ state: "initializing", workerId: id }),
    watchdog: new WorkerWatchdog(watchdogMs),
    worker,
  };
}

export function formatWatchdogTimeoutDetail(
  slotId: string,
  snapshot: WatchdogTimeoutSnapshot,
): string {
  return (
    `Watchdog timeout [${slotId}]: no worker heartbeat for ${Math.round(snapshot.silenceMs)}ms ` +
    `(limit=${snapshot.timeoutMs}ms, lastBeat=${snapshot.lastBeatReason}) ` +
    `job=${snapshot.jobId} chunk=${snapshot.chunkIndex} iters=${snapshot.iterations} ` +
    `elapsed=${Math.round(snapshot.elapsedMs)}ms`
  );
}
