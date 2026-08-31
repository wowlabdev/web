import "server-only";
import { createServerClient } from "@supabase/ssr";
import { type JwtPayload, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";
import { cache } from "react";

import { env } from "@wowlab/shared/lib/env";

import type { Database } from "./database.types";

export const createClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, options, value } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // setAll called from a Server Component; middleware refreshes sessions.
          }
        },
      },
    },
  );
});

export const getServerClaims = cache(async (): Promise<JwtPayload | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return data.claims;
});

export async function requireServerClaims(): Promise<{
  claims: JwtPayload;
  supabase: SupabaseClient<Database>;
}> {
  const claims = await getServerClaims();

  if (!claims) {
    unauthorized();
  }

  return { claims, supabase: await createClient() };
}
