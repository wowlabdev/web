import "server-only";

import type { JwtPayload } from "@supabase/supabase-js";
import type { NextResponse } from "next/server";

import {
  createClient,
  getServerClaims,
} from "@wowlab/shared/lib/supabase/server";

import { apiError, Status } from "./response";

export type AuthResult =
  { ok: true; claims: JwtPayload } | { ok: false; response: NextResponse };

export async function requireAdmin(): Promise<AuthResult> {
  const user = await requireUser();

  if (!user.ok) {
    return user;
  }

  const supabase = await createClient();
  const { data: isAdmin, error } = await supabase.rpc("is_admin");

  if (error || isAdmin !== true) {
    return {
      ok: false,
      response: apiError(Status.Unauthorized, "unauthorized"),
    };
  }

  return user;
}

export async function requireUser(): Promise<AuthResult> {
  const claims = await getServerClaims();

  if (!claims) {
    return {
      ok: false,
      response: apiError(Status.Unauthorized, "unauthorized"),
    };
  }

  return { claims, ok: true };
}
