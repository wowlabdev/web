"use client";

import type { z } from "zod";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemoizedFn } from "ahooks";
import initials from "initials";

import type { QueryResult } from "@/lib/data/result";
import type { OAuthProvider } from "@wowlab/shared/lib/providers";
import type { Row } from "@wowlab/shared/lib/supabase/types";

import { toQueryResult } from "@/lib/data/result";
import {
  parse,
  SubscriptionPlanSchema,
  SubscriptionStatusSchema,
} from "@/lib/zod";
import { routes } from "@wowlab/shared/lib/routing/routes";
import { absoluteUrl, href } from "@wowlab/shared/lib/routing/utils";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { AUTH_SUBSCRIPTION_KEY } from "./billing";
import { throwIfError } from "./shared";

export type AuthUser = {
  avatar: string;
  email: string;
  handle: string;
  initials: string;
  isAuthenticated: boolean;
  name: string;
  subscription: SubscriptionStatus;
};

type SubscriptionStatus = {
  isActive: boolean;
  isPastDue: boolean;
  plan: z.infer<typeof SubscriptionPlanSchema>;
  status: z.infer<typeof SubscriptionStatusSchema>;
};

const FREE_SUBSCRIPTION: SubscriptionStatus = {
  isActive: false,
  isPastDue: false,
  plan: "free",
  status: "free",
};

const ANONYMOUS: AuthUser = {
  avatar: "",
  email: "",
  handle: "",
  initials: "?",
  isAuthenticated: false,
  name: "Guest",
  subscription: FREE_SUBSCRIPTION,
};

const AUTH_USER_KEY = ["auth-user"] as const;

export const USER_PROFILE_KEY = ["user-profile"] as const;

type ProfileRotation = Pick<
  Row<"rotations">,
  "id" | "name" | "spec_id" | "updated_at"
>;

type ProfileWithRotations = {
  rotations: ProfileRotation[];
} & Row<"user_profiles">;

const PROFILE_KEY = ["user-profile-self"] as const;

type RawUser = {
  email: string | null;
  id: string;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
    user_name?: string;
  } & Record<string, unknown>;
};

export function useAuthUser(): AuthUser {
  const { data: user } = useRawUser();
  const userId = user?.id;

  const { data: profile } = useQuery({
    enabled: !!userId,
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("user_profiles")
        .select("handle")
        .eq("id", userId!)
        .single();

      return data;
    },
    queryKey: [...PROFILE_KEY, userId],
  });

  const { data: subscription } = useQuery({
    enabled: !!userId,
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("subscriptions")
        .select("status, plan")
        .eq("supabase_user_id", userId!)
        .order("occurred_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return data;
    },
    queryKey: [...AUTH_SUBSCRIPTION_KEY, userId],
  });

  if (!user) {
    return ANONYMOUS;
  }

  const meta = user.user_metadata;
  const name = meta.full_name ?? meta.user_name ?? user.email ?? "User";

  const sub: SubscriptionStatus = subscription
    ? {
        isActive:
          subscription.status === "active" ||
          subscription.status === "trialing",
        isPastDue: subscription.status === "past_due",
        plan: parse(SubscriptionPlanSchema, subscription.plan, "free"),
        status: parse(SubscriptionStatusSchema, subscription.status, "free"),
      }
    : FREE_SUBSCRIPTION;

  return {
    avatar: meta.avatar_url ?? "",
    email: user.email ?? "",
    handle: profile?.handle ?? "",
    initials: initials(name).toUpperCase(),
    isAuthenticated: true,
    name,
    subscription: sub,
  };
}

export function useUserAccount() {
  const user = useAuthUser();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const linkIdentity = useMemoizedFn(async (provider: OAuthProvider) => {
    const { error } = await supabase.auth.linkIdentity({
      options: {
        redirectTo: absoluteUrl("/auth/callback", {
          next: href(routes.account.settings),
        }),
      },
      provider,
    });

    throwIfError(error);
  });

  const deleteAccount = useMemoizedFn(async () => {
    const { error } = await supabase.rpc("delete_own_account");

    throwIfError(error);
    await supabase.auth.signOut();
    queryClient.clear();
  });

  const logout = useMemoizedFn(async () => {
    await supabase.auth.signOut();
    queryClient.clear();
  });

  return {
    deleteAccount,
    linkIdentity,
    logout,
    user,
  };
}

export function useUserId(): string | undefined {
  const { data: user } = useRawUser();

  return user?.id;
}

export function useUserProfile(
  handle: string,
): QueryResult<ProfileWithRotations> {
  const supabase = createClient();

  return toQueryResult(
    useQuery({
      enabled: !!handle,
      queryFn: async () => {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*, rotations(id, name, spec_id, updated_at)")
          .eq("handle", handle)
          .eq("rotations.is_public", true)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return null;
          }

          throw error;
        }

        return data as ProfileWithRotations;
      },
      queryKey: [...USER_PROFILE_KEY, handle],
    }),
  );
}

function useRawUser() {
  return useQuery({
    queryFn: async (): Promise<RawUser | null> => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getClaims();

      if (error || !data?.claims) {
        return null;
      }

      const claims = data.claims;

      return {
        email: claims.email ?? null,
        id: claims.sub,
        user_metadata: claims.user_metadata ?? {},
      };
    },
    queryKey: AUTH_USER_KEY,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
