import { NextResponse } from "next/server";
import { connection } from "next/server";

import { createClient } from "@wowlab/shared/lib/supabase/server";

export async function GET(request: Request) {
  await connection();

  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = resolveNext(searchParams.get("next"), origin);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(next);
    }
  }

  return NextResponse.redirect(`${origin}/auth/sign-in`);
}

// Open-redirect guard: only same-origin targets survive.
function resolveNext(next: string | null, origin: string): URL {
  try {
    const url = new URL(next ?? "/", origin);

    if (url.origin === origin) {
      return url;
    }
  } catch {
    /* empty */
  }

  return new URL("/", origin);
}
