import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { type NextRequest, type NextResponse } from "next/server";

import { env } from "@wowlab/shared/lib/env";

type PendingCookie = { name: string; options: CookieOptions; value: string };

// getClaims must run before buildResponse so the response carries refreshed cookies.
export async function updateSession(
  request: NextRequest,
  buildResponse: () => NextResponse | Promise<NextResponse>,
): Promise<NextResponse> {
  const pendingCookies: PendingCookie[] = [];
  const pendingHeaders: Record<string, string> = {};

  const supabase = createServerClient(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }

          pendingCookies.push(...cookiesToSet);
          Object.assign(pendingHeaders, headers);
        },
      },
    },
  );

  await supabase.auth.getClaims();

  const response = await buildResponse();

  for (const { name, options, value } of pendingCookies) {
    response.cookies.set(name, value, options);
  }

  for (const [key, value] of Object.entries(pendingHeaders)) {
    response.headers.set(key, value);
  }

  return response;
}
