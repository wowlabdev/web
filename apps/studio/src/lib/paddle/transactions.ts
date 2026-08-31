import "server-only";

import type { Transaction, TransactionStatus } from "@paddle/paddle-node-sdk";

import { describeBillingItems } from "@wowlab/shared/lib/billing/format";

import { getUserPaddleCustomerIds } from "./customers";
import { paddle } from "./server";

export type AdminTransaction = {
  billedAt: string | null;
  currencyCode: string;
  customerEmail: string | null;
  customerId: string | null;
  description: string;
  id: string;
  invoiceNumber: string | null;
  lineItems: AdminTransactionLineItem[];
  status: TransactionStatus;
  subscriptionId: string | null;
  totalMinor: string;
};

export type AdminTransactionLineItem = {
  description: string;
  id: string;
  priceId: string;
  quantity: number;
  totalMinor: string;
};

export type BillingTransaction = {
  billedAt: string | null;
  currencyCode: string;
  description: string;
  id: string;
  invoiceNumber: string | null;
  status: string;
  subscriptionId: string | null;
  totalMinor: string;
};

export async function getUserInvoicePdfUrl(
  userId: string,
  transactionId: string,
): Promise<string | null> {
  const customerIds = new Set(await getUserPaddleCustomerIds(userId));

  if (customerIds.size === 0) {
    return null;
  }

  const txn = await paddle.transactions.get(transactionId);

  if (!txn.customerId || !customerIds.has(txn.customerId)) {
    return null;
  }

  const pdf = await paddle.transactions.getInvoicePDF(transactionId);

  return pdf.url;
}

export async function listUserBillingTransactions(
  userId: string,
): Promise<BillingTransaction[]> {
  const customerIds = await getUserPaddleCustomerIds(userId);

  if (customerIds.length === 0) {
    return [];
  }

  const page = await paddle.transactions
    .list({
      customerId: customerIds,
      orderBy: "billed_at[DESC]",
      perPage: 25,
    })
    .next();

  return page.map((t) => ({
    billedAt: t.billedAt,
    currencyCode: t.currencyCode,
    description: describeBillingItems(
      t.items.map((i) => ({
        priceId: i.price?.id ?? "",
        quantity: i.quantity,
      })),
    ),
    id: t.id,
    invoiceNumber: t.invoiceNumber,
    status: t.status,
    subscriptionId: t.subscriptionId,
    totalMinor: t.details?.totals?.total ?? "0",
  }));
}

export function toAdminTransaction(
  t: Transaction,
  customerEmail: string | null,
): AdminTransaction {
  const lineItems: AdminTransactionLineItem[] = (
    t.details?.lineItems ?? []
  ).map((li) => ({
    description: describeBillingItems([
      { priceId: li.priceId, quantity: li.quantity },
    ]),
    id: li.id,
    priceId: li.priceId,
    quantity: li.quantity,
    totalMinor: li.totals?.total ?? "0",
  }));

  return {
    billedAt: t.billedAt,
    currencyCode: t.currencyCode,
    customerEmail,
    customerId: t.customerId,
    description: describeBillingItems(
      t.items.map((i) => ({
        priceId: i.price?.id ?? "",
        quantity: i.quantity,
      })),
    ),
    id: t.id,
    invoiceNumber: t.invoiceNumber,
    lineItems,
    status: t.status,
    subscriptionId: t.subscriptionId,
    totalMinor: t.details?.totals?.total ?? "0",
  };
}
