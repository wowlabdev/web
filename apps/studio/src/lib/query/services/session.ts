"use client";

import type { AuthChangeEvent, Provider, Session } from "@supabase/supabase-js";

import { absoluteUrl } from "@wowlab/shared/lib/routing/utils";
import { createClient } from "@wowlab/shared/lib/supabase/client";

export function fetchSessionClaims() {
  return createClient().auth.getClaims();
}

export function fetchTokenClaim(userId: string) {
  return createClient()
    .from("user_settings")
    .select("token_claim")
    .eq("id", userId)
    .single();
}

export async function sendEmailOtp(
  email: string,
  captchaToken: string,
): Promise<void> {
  const { error } = await createClient().auth.signInWithOtp({
    email,
    options: { captchaToken, shouldCreateUser: true },
  });

  if (error) {
    throw error;
  }
}

export async function signInWithProvider(
  provider: Provider,
  redirectTo?: string,
): Promise<void> {
  await createClient().auth.signInWithOAuth({
    options: {
      redirectTo: absoluteUrl(
        "/auth/callback",
        redirectTo ? { next: redirectTo } : undefined,
      ),
    },
    provider,
  });
}

export function subscribeToAuthChanges(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
): () => void {
  const {
    data: { subscription },
  } = createClient().auth.onAuthStateChange(callback);

  return () => subscription.unsubscribe();
}

export async function verifyEmailOtp(
  email: string,
  token: string,
): Promise<void> {
  const { error } = await createClient().auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    throw error;
  }
}
