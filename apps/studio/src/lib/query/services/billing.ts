import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { QueryListResult, QueryResult } from "@/lib/data/result";
import type { BillingTransaction } from "@/lib/paddle/transactions";
import type { Row, View } from "@wowlab/shared/lib/supabase/types";

import { toQueryListResult, toQueryResult } from "@/lib/data/result";
import { createClient } from "@wowlab/shared/lib/supabase/client";

import { fetchJson, throwIfError } from "./shared";
import { useUserId } from "./user";

export const AUTH_SUBSCRIPTION_KEY = ["auth-subscription"] as const;
export const BILLING_KEY = ["billing"] as const;
const SUBSCRIPTION_KEY = [...BILLING_KEY, "subscription"] as const;
const BOOST_BALANCE_KEY = [...BILLING_KEY, "boost-balance"] as const;
const BOOST_LEDGER_KEY = [...BILLING_KEY, "boost-ledger"] as const;
const TRANSACTIONS_KEY = [...BILLING_KEY, "transactions"] as const;

export function useBoostBalance(): QueryResult<number> {
  const userId = useUserId();

  return toQueryResult(
    useQuery<number>({
      enabled: !!userId,
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("boost_balances")
          .select("balance")
          .eq("supabase_user_id", userId!)
          .maybeSingle<View<"boost_balances">>();

        throwIfError(error);

        return data?.balance ?? 0;
      },
      queryKey: [...BOOST_BALANCE_KEY, userId],
    }),
  );
}

export function useBoostLedger(
  limit = 25,
): QueryListResult<Row<"boost_ledger">> {
  const userId = useUserId();

  return toQueryListResult(
    useQuery<Row<"boost_ledger">[]>({
      enabled: !!userId,
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("boost_ledger")
          .select("*")
          .eq("supabase_user_id", userId!)
          .order("created_at", { ascending: false })
          .limit(limit);

        throwIfError(error);

        return data ?? [];
      },
      queryKey: [...BOOST_LEDGER_KEY, userId, limit],
    }),
  );
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { subscriptionId: string; immediate?: boolean }
  >({
    mutationFn: async ({ immediate, subscriptionId }) => {
      await fetchJson<unknown>(
        "/api/paddle/cancel-subscription",
        {
          body: JSON.stringify({ immediate: !!immediate, subscriptionId }),
          headers: { "content-type": "application/json" },
          method: "POST",
        },
        "cancel failed",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEY });
      queryClient.invalidateQueries({ queryKey: AUTH_SUBSCRIPTION_KEY });
    },
  });
}

export function usePauseSubscription() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { subscriptionId: string }>({
    mutationFn: async ({ subscriptionId }) => {
      await fetchJson<unknown>(
        "/api/paddle/pause-subscription",
        {
          body: JSON.stringify({ subscriptionId }),
          headers: { "content-type": "application/json" },
          method: "POST",
        },
        "pause failed",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEY });
      queryClient.invalidateQueries({ queryKey: AUTH_SUBSCRIPTION_KEY });
    },
  });
}

export function usePaymentMethodTransaction() {
  return useMutation<string, Error, { subscriptionId: string }>({
    mutationFn: async ({ subscriptionId }) => {
      const body = await fetchJson<{ transactionId?: string }>(
        "/api/paddle/payment-method-transaction",
        {
          body: JSON.stringify({ subscriptionId }),
          headers: { "content-type": "application/json" },
          method: "POST",
        },
        "failed",
      );

      if (!body.transactionId) {
        throw new Error("missing transaction id");
      }

      return body.transactionId;
    },
  });
}

export function useResumeSubscription() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { subscriptionId: string }>({
    mutationFn: async ({ subscriptionId }) => {
      await fetchJson<unknown>(
        "/api/paddle/resume-subscription",
        {
          body: JSON.stringify({ subscriptionId }),
          headers: { "content-type": "application/json" },
          method: "POST",
        },
        "resume failed",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEY });
      queryClient.invalidateQueries({ queryKey: AUTH_SUBSCRIPTION_KEY });
    },
  });
}

export function useSubscription(): QueryResult<Row<"subscriptions">> {
  const userId = useUserId();

  return toQueryResult(
    useQuery<Row<"subscriptions"> | null>({
      enabled: !!userId,
      queryFn: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("supabase_user_id", userId!)
          .order("occurred_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        throwIfError(error);

        return data;
      },
      queryKey: [...SUBSCRIPTION_KEY, userId],
    }),
  );
}

export function useTransactions(): QueryListResult<BillingTransaction> {
  const userId = useUserId();

  return toQueryListResult(
    useQuery<BillingTransaction[]>({
      enabled: !!userId,
      queryFn: async () => {
        const body = await fetchJson<{
          transactions: BillingTransaction[];
        }>(
          "/api/paddle/transactions",
          undefined,
          "failed to load transactions",
        );

        return body.transactions;
      },
      queryKey: [...TRANSACTIONS_KEY, userId],
    }),
  );
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { subscriptionId: string; priceId: string; quantity: number }
  >({
    mutationFn: async ({ priceId, quantity, subscriptionId }) => {
      await fetchJson<unknown>(
        "/api/paddle/update-subscription",
        {
          body: JSON.stringify({ priceId, quantity, subscriptionId }),
          headers: { "content-type": "application/json" },
          method: "POST",
        },
        "update failed",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEY });
      queryClient.invalidateQueries({ queryKey: AUTH_SUBSCRIPTION_KEY });
    },
  });
}
