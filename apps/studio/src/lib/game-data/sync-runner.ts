import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@wowlab/shared/lib/supabase/database.types";

import { env } from "@wowlab/shared/lib/env";

import type { GameDb } from "./store";

import { syncGameData } from "./sync";

let client: SupabaseClient<Database> | undefined;

let syncPromise: Promise<void> | null = null;

export function resetGameDataSync(): void {
  syncPromise = null;
}

export function runGameDataSync(gameDb: GameDb): Promise<void> {
  syncPromise ??= syncGameData(gameDb, gameDataClient());

  return syncPromise;
}

function gameDataClient(): SupabaseClient<Database> {
  client ??= createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
        storageKey: "sb-wowlab-gamedata",
      },
    },
  );

  return client;
}
