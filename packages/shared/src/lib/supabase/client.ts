"use client";

import { createBrowserClient } from "@supabase/ssr";

import { env } from "@wowlab/shared/lib/env";

import type { Database } from "./database.types";

// docref:start state-mgmt-supabase-client
let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  client ??= createBrowserClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
  );

  return client;
}
// docref:end state-mgmt-supabase-client
