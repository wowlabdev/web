"use client";

import type { z } from "zod";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { AdminAdjustment } from "@/app/api/paddle/admin/adjustments/route";
import type { AdminCustomerDetail } from "@/app/api/paddle/admin/customers/[id]/route";
import type { AdminCustomer } from "@/app/api/paddle/admin/customers/route";
import type { AdminSubscription } from "@/app/api/paddle/admin/subscriptions/route";
import type { QueryListResult, QueryResult } from "@/lib/data/result";
import type { AdminBillingOverview } from "@/lib/paddle/overview";
import type { AdminTransaction } from "@/lib/paddle/transactions";
import type {
  AdminCreateAdjustmentSchema,
  AdminUpdateSubscriptionSchema,
} from "@/lib/zod";

import { toQueryListResult, toQueryResult } from "@/lib/data/result";

import { BILLING_KEY } from "../billing";
import { fetchJson } from "../shared";
import {
  BILLING_CUSTOMER_KEY,
  BILLING_CUSTOMERS_KEY,
  BILLING_OVERVIEW_KEY,
  BILLING_SUBSCRIPTIONS_KEY,
  BILLING_TRANSACTIONS_KEY,
  invalidateBillingMutations,
} from "./keys";

type AdminSubscriptionsParams = {
  customerId?: string;
  status?: string[];
};

type AdminTransactionsParams = {
  billedAfter?: string;
  customerId?: string;
  status?: string[];
};

type CreateAdjustmentInput = z.infer<typeof AdminCreateAdjustmentSchema>;
type UpdateSubscriptionInput = z.infer<typeof AdminUpdateSubscriptionSchema>;

export function useAdminBillingOverview(): QueryResult<AdminBillingOverview> {
  return toQueryResult(
    useQuery<AdminBillingOverview>({
      queryFn: () =>
        fetchJson<AdminBillingOverview>("/api/paddle/admin/overview"),
      queryKey: BILLING_OVERVIEW_KEY,
    }),
  );
}

export function useAdminCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { immediate: boolean; subscriptionId: string }
  >({
    mutationFn: async ({ immediate, subscriptionId }) => {
      await fetchJson<unknown>(
        `/api/paddle/admin/subscriptions/${subscriptionId}/cancel`,
        {
          body: JSON.stringify({ immediate }),
          headers: { "content-type": "application/json" },
          method: "POST",
        },
      );
    },
    onSuccess: () => {
      invalidateBillingMutations(queryClient);
    },
  });
}

export function useAdminCustomer(
  customerId: string | null,
): QueryResult<AdminCustomerDetail> {
  return toQueryResult(
    useQuery<AdminCustomerDetail>({
      enabled: !!customerId,
      queryFn: () =>
        fetchJson<AdminCustomerDetail>(
          `/api/paddle/admin/customers/${customerId}`,
        ),
      queryKey: [...BILLING_CUSTOMER_KEY, customerId],
    }),
  );
}

export function useAdminCustomers(search = ""): QueryListResult<AdminCustomer> {
  return toQueryListResult(
    useQuery<AdminCustomer[]>({
      queryFn: async () => {
        const params = new URLSearchParams();

        if (search) {
          params.set("search", search);
        }

        const qs = params.toString();
        const url = qs
          ? `/api/paddle/admin/customers?${qs}`
          : "/api/paddle/admin/customers";
        const body = await fetchJson<{ customers: AdminCustomer[] }>(url);

        return body.customers;
      },
      queryKey: [...BILLING_CUSTOMERS_KEY, search],
    }),
  );
}

export function useAdminPauseSubscription() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { immediate: boolean; subscriptionId: string }
  >({
    mutationFn: async ({ immediate, subscriptionId }) => {
      await fetchJson<unknown>(
        `/api/paddle/admin/subscriptions/${subscriptionId}/pause`,
        {
          body: JSON.stringify({ immediate }),
          headers: { "content-type": "application/json" },
          method: "POST",
        },
      );
    },
    onSuccess: () => {
      invalidateBillingMutations(queryClient);
    },
  });
}

export function useAdminResumeSubscription() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { subscriptionId: string }>({
    mutationFn: async ({ subscriptionId }) => {
      await fetchJson<unknown>(
        `/api/paddle/admin/subscriptions/${subscriptionId}/resume`,
        { method: "POST" },
      );
    },
    onSuccess: () => {
      invalidateBillingMutations(queryClient);
    },
  });
}

export function useAdminSubscriptions(
  params: AdminSubscriptionsParams,
): QueryListResult<AdminSubscription> {
  const customerId = params.customerId ?? "";
  const statusJoined = params.status?.slice().sort().join(",") ?? "";

  return toQueryListResult(
    useQuery<AdminSubscription[]>({
      queryFn: async () => {
        const search = new URLSearchParams();

        if (customerId) {
          search.set("customerId", customerId);
        }

        if (statusJoined) {
          search.set("status", statusJoined);
        }

        const qs = search.toString();
        const url = qs
          ? `/api/paddle/admin/subscriptions?${qs}`
          : "/api/paddle/admin/subscriptions";
        const body = await fetchJson<{ subscriptions: AdminSubscription[] }>(
          url,
        );

        return body.subscriptions;
      },
      queryKey: [...BILLING_SUBSCRIPTIONS_KEY, customerId, statusJoined],
    }),
  );
}

export function useAdminTransactions(
  params: AdminTransactionsParams,
): QueryListResult<AdminTransaction> {
  const customerId = params.customerId ?? "";
  const billedAfter = params.billedAfter ?? "";
  const statusJoined = params.status?.slice().sort().join(",") ?? "";

  return toQueryListResult(
    useQuery<AdminTransaction[]>({
      queryFn: async () => {
        const search = new URLSearchParams();

        if (customerId) {
          search.set("customerId", customerId);
        }

        if (billedAfter) {
          search.set("billedAfter", billedAfter);
        }

        if (statusJoined) {
          search.set("status", statusJoined);
        }

        const qs = search.toString();
        const url = qs
          ? `/api/paddle/admin/transactions?${qs}`
          : "/api/paddle/admin/transactions";
        const body = await fetchJson<{ transactions: AdminTransaction[] }>(url);

        return body.transactions;
      },
      queryKey: [
        ...BILLING_TRANSACTIONS_KEY,
        customerId,
        statusJoined,
        billedAfter,
      ],
    }),
  );
}

export function useAdminUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { subscriptionId: string } & UpdateSubscriptionInput
  >({
    mutationFn: async ({ priceId, quantity, subscriptionId }) => {
      await fetchJson<unknown>(
        `/api/paddle/admin/subscriptions/${subscriptionId}/update`,
        {
          body: JSON.stringify({ priceId, quantity }),
          headers: { "content-type": "application/json" },
          method: "POST",
        },
      );
    },
    onSuccess: () => {
      invalidateBillingMutations(queryClient);
    },
  });
}

export function useCreateAdjustment() {
  const queryClient = useQueryClient();

  return useMutation<AdminAdjustment, Error, CreateAdjustmentInput>({
    mutationFn: async (input) => {
      const body = await fetchJson<{ adjustment: AdminAdjustment }>(
        "/api/paddle/admin/adjustments",
        {
          body: JSON.stringify(input),
          headers: { "content-type": "application/json" },
          method: "POST",
        },
      );

      return body.adjustment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: BILLING_OVERVIEW_KEY });
      queryClient.invalidateQueries({ queryKey: BILLING_CUSTOMER_KEY });
      queryClient.invalidateQueries({ queryKey: BILLING_SUBSCRIPTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: BILLING_KEY });
    },
  });
}
