import { create } from "zustand";

import type { ChunkPayload } from "./realtime";
import type { WorkerManager } from "./worker-manager";
import type { WorkerMetrics } from "./worker-metrics";

import { formatError } from "./format-error";

export type NodeStatus = "idle" | "registering" | "connected" | "error";

type RuntimeActions = {
  setStatus: (status: NodeStatus) => void;
  log: (message: string) => void;
  clearLog: () => void;
  appendChunk: (chunk: ChunkPayload) => void;
  setWorkerMetrics: (metrics: WorkerMetrics | null) => void;
  setManager: (manager: WorkerManager | null) => void;
  killWorker: () => void;
  restartWorker: () => void;
  reprimeWorker: () => void;
  setWorkerEnabled: (workerId: string, enabled: boolean) => void;
  setWorkerPoolSize: (size: number) => void;
};

type RuntimeState = {
  status: NodeStatus;
  debugLog: string[];
  chunks: ChunkPayload[];
  workerMetrics: WorkerMetrics | null;
  // Shared imperative handle; not selected by any component, so updates re-render nothing.
  manager: WorkerManager | null;
};

export const useRuntimeStore = create<RuntimeActions & RuntimeState>(
  (set, get) => ({
    appendChunk: (chunk) => set((s) => ({ chunks: [...s.chunks, chunk] })),
    chunks: [],
    clearLog: () => set({ debugLog: [] }),
    debugLog: [],
    killWorker: () => {
      get().manager?.kill();
      get().log("Worker killed");
    },

    log: (message) =>
      set((s) => ({
        debugLog: [
          ...s.debugLog,
          `${new Date().toISOString().slice(11, 23)} ${message}`,
        ],
      })),
    manager: null,
    reprimeWorker: () => {
      const { log, manager } = get();

      void manager
        ?.reprimeIfBooted()
        .catch((error) => log(`Worker re-prime failed: ${formatError(error)}`));
    },
    restartWorker: () => {
      const { log, manager } = get();

      log("Restarting worker...");
      manager
        ?.restart()
        .then(() => log("Worker restarted"))
        .catch((error) => log(`Worker restart failed: ${formatError(error)}`));
    },
    setManager: (manager) => set({ manager }),
    setStatus: (status) => set({ status }),
    setWorkerEnabled: (workerId, enabled) => {
      get().manager?.setWorkerEnabled(workerId, enabled);
      get().log(`Worker ${workerId} ${enabled ? "enabled" : "disabled"}`);
    },

    setWorkerMetrics: (workerMetrics) => set({ workerMetrics }),
    setWorkerPoolSize: (size) => {
      get().manager?.setPoolSize(size);
      get().log(`Worker pool size set to ${size}`);
    },
    status: "idle",
    workerMetrics: null,
  }),
);
