import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@wowlab/shared/lib/supabase/database.types";

import type { WorkerSupabaseClient } from "./resolver-types";
import type { WorkerEnv } from "./worker-contract";

export function createWorkerSupabaseClient(
  workerEnv: WorkerEnv,
): WorkerSupabaseClient {
  return createSupabaseClient<Database>(
    workerEnv.supabaseUrl,
    workerEnv.supabasePublishableKey,
    { auth: { detectSessionInUrl: false, persistSession: false } },
  );
}
