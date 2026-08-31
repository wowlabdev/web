import type { GameCollectionName } from "@/lib/game-data/store";

import type { ChunkPayload } from "./realtime";
import type { WorkerMetrics } from "./worker-metrics";

export type NodeKeypair = {
  privateKey: string;
  publicKey: string;
};

export type ResolveEntity = "item" | "spell";

export type ResolveEvent =
  | { entity: ResolveEntity; id: number; kind: "entity"; source: ResolveSource }
  | { kind: "table"; table: GameCollectionName };

export type ResolveEventHandler = (event: ResolveEvent) => void;

export type ResolveSource = "store" | "supabase";

export type WorkerChunkPayload = ChunkPayload;

export type WorkerEnv = {
  sentinelUrl: string;
  supabasePublishableKey: string;
  supabaseUrl: string;
};

export type WorkerMetricsHandler = (metrics: WorkerMetrics) => void;

export type WorkerProgressHandler = (message: string) => void;

export type WorkerRunResult = {
  error?: string;
  isSuccess: boolean;
};
