import "server-only";

import type { Subscription, Transaction } from "@paddle/paddle-node-sdk";

import { log } from "@/lib/observability";

export type AdminBillingDailyPoint = {
  date: string;
  failed: number;
  paid: number;
  revenueMinor: number;
};

export type AdminBillingOverview = {
  activeSubscriptions: number;
  activeSubscriptionsByPlan: Record<string, number>;
  daily: AdminBillingDailyPoint[];
  failedTransactions30d: number;
  monthlyRecurringRevenueMinorByCurrency: Record<string, string>;
  paidRevenueMinor30dByCurrency: Record<string, string>;
  paidTransactions30d: number;
};

const DAYS_PER_INTERVAL: Record<"day" | "week" | "month" | "year", bigint> = {
  day: 1n,
  month: 30n,
  week: 7n,
  year: 365n,
};
const DAYS_PER_MONTH = 30n;

export function buildAdminOverview(
  activeSubs: Subscription[],
  paidTxns: Transaction[],
  pastDueTxns: Transaction[],
): AdminBillingOverview {
  const { mrrByCurrency, planCounts } = computeSubscriptionMetrics(activeSubs);

  const today = new Date();

  today.setUTCHours(0, 0, 0, 0);
  const { daily, dateIndex } = buildDailyBuckets(today);

  applyPaidTransactions(paidTxns, daily, dateIndex);
  applyPastDueTransactions(pastDueTxns, daily, dateIndex);

  const last30 = daily.slice(-30);
  const paidTransactions30d = last30.reduce((acc, d) => acc + d.paid, 0);
  const failedTransactions30d = last30.reduce((acc, d) => acc + d.failed, 0);

  const cutoff = new Date(today);

  cutoff.setUTCDate(cutoff.getUTCDate() - 29);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  const paidRevenue30dByCurrency = sumPaidRevenue30d(paidTxns, cutoffKey);

  return {
    activeSubscriptions: activeSubs.length,
    activeSubscriptionsByPlan: planCounts,
    daily,
    failedTransactions30d,
    monthlyRecurringRevenueMinorByCurrency: bigIntMapToRecord(mrrByCurrency),
    paidRevenueMinor30dByCurrency: bigIntMapToRecord(paidRevenue30dByCurrency),
    paidTransactions30d,
  };
}

function addSubscriptionMrr(
  mrrByCurrency: Map<string, bigint>,
  sub: Subscription,
  cycleDays: bigint,
): void {
  for (const item of sub.items) {
    const amount = safeBigInt(item.price.unitPrice.amount);

    if (amount === null) {
      continue;
    }

    const itemTotal = amount * BigInt(item.quantity);
    const monthly = (itemTotal * DAYS_PER_MONTH) / cycleDays;
    const cc = item.price.unitPrice.currencyCode;

    mrrByCurrency.set(cc, (mrrByCurrency.get(cc) ?? 0n) + monthly);
  }
}

function applyPaidTransactions(
  paidTxns: Transaction[],
  daily: AdminBillingDailyPoint[],
  dateIndex: Map<string, number>,
): void {
  for (const t of paidTxns) {
    const billedAt = t.billedAt;

    if (!billedAt) {
      continue;
    }

    const idx = dateIndex.get(billedAt.slice(0, 10));

    if (idx === undefined) {
      continue;
    }

    daily[idx]!.paid += 1;

    const totalMinor = t.details?.totals?.total;
    const minor = totalMinor ? safeBigInt(totalMinor) : null;

    if (minor === null) {
      continue;
    }

    if (t.currencyCode !== "USD") {
      log
        .withMetadata({
          cc: t.currencyCode,
          txnId: t.id,
        })
        .warn("non-USD paid transaction included in chart");
    }

    daily[idx]!.revenueMinor += Number(minor);
  }
}

function applyPastDueTransactions(
  pastDueTxns: Transaction[],
  daily: AdminBillingDailyPoint[],
  dateIndex: Map<string, number>,
): void {
  for (const t of pastDueTxns) {
    const billedAt = t.billedAt;

    if (!billedAt) {
      continue;
    }

    const idx = dateIndex.get(billedAt.slice(0, 10));

    if (idx !== undefined) {
      daily[idx]!.failed += 1;
    }
  }
}

function bigIntMapToRecord(map: Map<string, bigint>): Record<string, string> {
  const record: Record<string, string> = {};

  for (const [cc, value] of map) {
    record[cc] = value.toString();
  }

  return record;
}

function buildDailyBuckets(today: Date): {
  daily: AdminBillingDailyPoint[];
  dateIndex: Map<string, number>;
} {
  const daily: AdminBillingDailyPoint[] = [];
  const dateIndex = new Map<string, number>();

  for (let i = 89; i >= 0; i -= 1) {
    const d = new Date(today);

    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);

    dateIndex.set(key, daily.length);
    daily.push({ date: key, failed: 0, paid: 0, revenueMinor: 0 });
  }

  return { daily, dateIndex };
}

function computeSubscriptionMetrics(activeSubs: Subscription[]): {
  mrrByCurrency: Map<string, bigint>;
  planCounts: Record<string, number>;
} {
  const mrrByCurrency = new Map<string, bigint>();
  const planCounts: Record<string, number> = {};

  for (const sub of activeSubs) {
    const planId = sub.items[0]?.price.id;

    if (planId) {
      planCounts[planId] = (planCounts[planId] ?? 0) + 1;
    }

    const interval = sub.billingCycle.interval;
    const cycleDays =
      DAYS_PER_INTERVAL[interval] * BigInt(sub.billingCycle.frequency);

    if (cycleDays === 0n) {
      continue;
    }

    addSubscriptionMrr(mrrByCurrency, sub, cycleDays);
  }

  return { mrrByCurrency, planCounts };
}

function safeBigInt(value: string): bigint | null {
  if (!/^-?\d+$/.test(value)) {
    return null;
  }

  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

function sumPaidRevenue30d(
  paidTxns: Transaction[],
  cutoffKey: string,
): Map<string, bigint> {
  const paidRevenue30dByCurrency = new Map<string, bigint>();

  for (const t of paidTxns) {
    const billedAt = t.billedAt;

    if (!billedAt) {
      continue;
    }

    if (billedAt.slice(0, 10) < cutoffKey) {
      continue;
    }

    const totalMinor = t.details?.totals?.total;
    const minor = totalMinor ? safeBigInt(totalMinor) : null;

    if (minor === null) {
      continue;
    }

    paidRevenue30dByCurrency.set(
      t.currencyCode,
      (paidRevenue30dByCurrency.get(t.currencyCode) ?? 0n) + minor,
    );
  }

  return paidRevenue30dByCurrency;
}
