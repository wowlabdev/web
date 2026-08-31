"use client";

import { env } from "@wowlab/shared/lib/env";
import { createClient } from "@wowlab/shared/lib/supabase/client";

const AI_BASE = `${env.SUPABASE_URL}/functions/v1/ai`;

export async function aiFetch(path: string, body: unknown): Promise<Response> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token ?? "";

  return fetch(`${AI_BASE}/${path}`, {
    body: JSON.stringify(body),
    headers: {
      apikey: env.SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    method: "POST",
  });
}
