import type { SubscriptionStatus } from "@paddle/paddle-node-sdk";

import { connection, type NextRequest, NextResponse } from "next/server";

import { log } from "@/lib/observability";
import { getPaddleCustomerLinks } from "@/lib/paddle/customers";
import { paddle } from "@/lib/paddle/server";
import { PaddleSubscriptionStatusSchema } from "@/lib/zod";
import { requireAdmin } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export type AdminSubscription = {
  customerEmail: string | null;
  customerId: string;
  id: string;
  nextBilledAt: string | null;
  plan: string;
  quantity: number;
  status: SubscriptionStatus;
};

export async function GET(request: NextRequest) {
  await connection();

  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const statusCsv = request.nextUrl.searchParams.get("status");
  const statusResult = statusCsv
    ? PaddleSubscriptionStatusSchema.array().safeParse(
        statusCsv.split(",").filter(Boolean),
      )
    : null;

  if (statusResult && !statusResult.success) {
    return apiError(Status.BadRequest, "invalid status filter");
  }

  const customerId = request.nextUrl.searchParams.get("customerId");

  try {
    const page = await paddle.subscriptions
      .list({
        ...(customerId ? { customerId: [customerId] } : {}),
        ...(statusResult?.data ? { status: statusResult.data } : {}),
        perPage: 50,
      })
      .next();

    const customerIds = page.map((s) => s.customerId);
    const links = await getPaddleCustomerLinks(customerIds);

    const subscriptions: AdminSubscription[] = page.map((sub) => {
      const first = sub.items[0];

      return {
        customerEmail: links.get(sub.customerId)?.email ?? null,
        customerId: sub.customerId,
        id: sub.id,
        nextBilledAt: sub.nextBilledAt,
        plan: first.price.id,
        quantity: first.quantity,
        status: sub.status,
      };
    });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    log.withError(error).error("admin paddle list subscriptions failed");

    return apiError(Status.BadGateway, "failed to list subscriptions");
  }
}
