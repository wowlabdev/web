import { connection, type NextRequest, NextResponse } from "next/server";

import type { AdminAdjustment } from "@/app/api/paddle/admin/adjustments/route";
import type { AdminCustomer } from "@/app/api/paddle/admin/customers/route";
import type { AdminSubscription } from "@/app/api/paddle/admin/subscriptions/route";
import type { AdminTransaction } from "@/lib/paddle/transactions";
import type { Row } from "@wowlab/shared/lib/supabase/types";

import { log } from "@/lib/observability";
import { getPaddleCustomerLinks } from "@/lib/paddle/customers";
import { collectAll } from "@/lib/paddle/pagination";
import { paddle } from "@/lib/paddle/server";
import { toAdminTransaction } from "@/lib/paddle/transactions";
import { requireAdmin } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";
import { createAdminClient } from "@wowlab/shared/lib/supabase/admin";

export type AdminCustomerDetail = {
  adjustments: AdminAdjustment[];
  boostLedger: Row<"boost_ledger">[];
  customer: AdminCustomer;
  subscriptions: AdminSubscription[];
  transactions: AdminTransaction[];
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connection();

  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;

  try {
    const [
      customer,
      subscriptionsPage,
      transactionsPage,
      adjustmentsPage,
      links,
    ] = await Promise.all([
      paddle.customers.get(id),
      paddle.subscriptions.list({ customerId: [id], perPage: 50 }).next(),
      paddle.transactions
        .list({
          customerId: [id],
          orderBy: "billed_at[DESC]",
          perPage: 100,
        })
        .next(),
      collectAll(paddle.adjustments.list({ customerId: [id], perPage: 50 })),
      getPaddleCustomerLinks([id]),
    ]);

    const link = links.get(id) ?? null;

    let boostLedger: Row<"boost_ledger">[] = [];

    if (link?.supabaseUserId) {
      const { data } = await createAdminClient()
        .from("boost_ledger")
        .select("*")
        .eq("supabase_user_id", link.supabaseUserId)
        .order("created_at", { ascending: false })
        .limit(100);

      boostLedger = data ?? [];
    }

    const adminCustomer: AdminCustomer = {
      createdAt: customer.createdAt,
      email: customer.email,
      id: customer.id,
      name: customer.name,
      status: customer.status,
      supabaseUserId: link?.supabaseUserId ?? null,
    };

    const subscriptions: AdminSubscription[] = subscriptionsPage.map((sub) => {
      const first = sub.items[0];

      return {
        customerEmail: link?.email ?? null,
        customerId: sub.customerId,
        id: sub.id,
        nextBilledAt: sub.nextBilledAt,
        plan: first.price.id,
        quantity: first.quantity,
        status: sub.status,
      };
    });

    const transactions: AdminTransaction[] = transactionsPage.map((t) =>
      toAdminTransaction(t, link?.email ?? null),
    );

    const adjustments: AdminAdjustment[] = adjustmentsPage.map((adj) => ({
      action: adj.action,
      createdAt: adj.createdAt,
      currencyCode: adj.currencyCode,
      id: adj.id,
      reason: adj.reason,
      status: adj.status,
      totalMinor: adj.totals.total,
      transactionId: adj.transactionId,
    }));

    const detail: AdminCustomerDetail = {
      adjustments,
      boostLedger,
      customer: adminCustomer,
      subscriptions,
      transactions,
    };

    return NextResponse.json(detail);
  } catch (error) {
    log
      .withMetadata({ id })
      .withError(error)
      .error("admin paddle get customer failed");

    return apiError(Status.BadGateway, "failed to load customer");
  }
}
