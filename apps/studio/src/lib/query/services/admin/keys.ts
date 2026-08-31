import type { QueryClient } from "@tanstack/react-query";

import { AUTH_SUBSCRIPTION_KEY, BILLING_KEY } from "../billing";

export const OVERVIEW_KEY = ["admin", "overview"] as const;

export const PAPERDOLLS_KEY = ["admin", "paperdolls"] as const;

export const RESERVED_HANDLES_KEY = ["admin", "reserved-handles"] as const;

export const SEASONS_KEY = ["admin", "seasons"] as const;

export const SHORT_URLS_KEY = ["admin", "short-urls"] as const;

export const BILLING_OVERVIEW_KEY = ["admin", "billing", "overview"] as const;

export const BILLING_TRANSACTIONS_KEY = [
  "admin",
  "billing",
  "transactions",
] as const;

export const BILLING_SUBSCRIPTIONS_KEY = [
  "admin",
  "billing",
  "subscriptions",
] as const;

export const BILLING_CUSTOMERS_KEY = ["admin", "billing", "customers"] as const;

export const BILLING_CUSTOMER_KEY = ["admin", "billing", "customer"] as const;

export function invalidateBillingMutations(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: BILLING_SUBSCRIPTIONS_KEY });
  qc.invalidateQueries({ queryKey: BILLING_OVERVIEW_KEY });
  qc.invalidateQueries({ queryKey: BILLING_CUSTOMER_KEY });
  qc.invalidateQueries({ queryKey: BILLING_KEY });
  qc.invalidateQueries({ queryKey: AUTH_SUBSCRIPTION_KEY });
}
