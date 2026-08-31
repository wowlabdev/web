export type WorkerMetrics = {
  avgSimsPerSec: number;
  cacheHits: number;
  cacheMisses: number;
  chunkElapsedMs?: number;
  chunksCompleted: number;
  chunksFailed: number;
  currentChunkIndex?: number;
  currentIterations?: number;
  currentJobId?: string;
  currentPhase?: WorkerPhase;
  isEnabled?: boolean;
  lastChunkMs: number;
  lastPayloadBytes: number;
  liveCompleted: number;
  liveSimsPerSec: number;
  liveTotal: number;
  measuredAt: number;
  poolSize?: number;
  state: WorkerState;
  totalIterations: number;
  totalSimTimeMs: number;
  uptimeMs: number;
  wasmHeapBytes: number;
  wasmInitMs: number;
  workerId: string;
  workers?: WorkerMetrics[];
};

export type WorkerPhase = "fetching" | "simulating" | "signing" | "submitting";

export type WorkerState =
  "idle" | "initializing" | "ready" | "busy" | "error" | "terminated";

export const DEFAULT_WORKER_METRICS = {
  avgSimsPerSec: 0,
  cacheHits: 0,
  cacheMisses: 0,
  chunksCompleted: 0,
  chunksFailed: 0,
  lastChunkMs: 0,
  lastPayloadBytes: 0,
  liveCompleted: 0,
  liveSimsPerSec: 0,
  liveTotal: 0,
  totalIterations: 0,
  totalSimTimeMs: 0,
  uptimeMs: 0,
  wasmHeapBytes: 0,
  wasmInitMs: 0,
} as const;

export function createWorkerMetrics(
  overrides: Partial<WorkerMetrics> = {},
): WorkerMetrics {
  return {
    ...DEFAULT_WORKER_METRICS,
    measuredAt: Date.now(),
    state: "idle",
    workerId: "",
    ...overrides,
  };
}
