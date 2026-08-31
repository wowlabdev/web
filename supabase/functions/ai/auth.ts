import { createClient } from "@supabase/supabase-js";

import { requireEnv } from "../_shared/env.ts";

const authClient = createClient(
  requireEnv("SUPABASE_URL"),
  requireEnv("SUPABASE_ANON_KEY"),
);

export async function verifyUser(req: Request): Promise<string | null> {
  const header = req.headers.get("Authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return null;
  }

  const { data, error } = await authClient.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  return data.user.id;
}
