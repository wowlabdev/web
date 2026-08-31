import type { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { GameDb } from "@/lib/game-data/store";
import type { Database } from "@wowlab/shared/lib/supabase/database.types";

import type { ScalingResolverData } from "./scaling";
import type {
  ResolveEventHandler,
  WorkerProgressHandler,
} from "./worker-contract";

export type ResolverCounters = {
  cacheHits: number;
  cacheMisses: number;
};

export type ResolverDeps = {
  counters: ResolverCounters;
  onEvent?: ResolveEventHandler;
  onProgress?: WorkerProgressHandler;
  store: WorkerStore;
  supabase: WorkerSupabaseClient;
};

export type WorkerStore = {
  expansionTraitsCache: Map<string, unknown>;
  gameDb: GameDb;
  itemCache: Map<number, unknown>;
  powerTypes: unknown[];
  rotationCache: Map<string, string>;
  scalingResolver: ScalingResolverData;
  specsCache: Map<number, unknown>;
  specsTraitsCache: Map<number, unknown>;
  spellCache: Map<number, unknown>;
};

export type WorkerSupabaseClient = ReturnType<
  typeof createSupabaseClient<Database>
>;
