import { connection, type NextRequest, NextResponse } from "next/server";

import { log } from "@/lib/observability";
import { getPaddleCustomerLinks } from "@/lib/paddle/customers";
import { clampPerPage } from "@/lib/paddle/pagination";
import { paddle } from "@/lib/paddle/server";
import { toAdminTransaction } from "@/lib/paddle/transactions";
import { PaddleTransactionStatusSchema } from "@/lib/zod";
import { requireAdmin } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function GET(request: NextRequest) {
  await connection();

  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const statusCsv = request.nextUrl.searchParams.get("status");
  const statusResult = statusCsv
    ? PaddleTransactionStatusSchema.array().safeParse(
        statusCsv.split(",").filter(Boolean),
      )
    : null;

  if (statusResult && !statusResult.success) {
    return apiError(Status.BadRequest, "invalid status filter");
  }

  const customerId = request.nextUrl.searchParams.get("customerId");
  const billedAfter = request.nextUrl.searchParams.get("billedAfter");
  const perPage = clampPerPage(
    request.nextUrl.searchParams.get("perPage"),
    50,
    200,
  );

  try {
    const page = await paddle.transactions
      .list({
        ...(customerId ? { customerId: [customerId] } : {}),
        ...(statusResult?.data ? { status: statusResult.data } : {}),
        ...(billedAfter ? { "billedAt[GTE]": billedAfter } : {}),
        orderBy: "billed_at[DESC]",
        perPage,
      })
      .next();

    const customerIds = page
      .map((t) => t.customerId)
      .filter((id): id is string => !!id);
    const links = await getPaddleCustomerLinks(customerIds);

    const transactions = page.map((t) =>
      toAdminTransaction(
        t,
        t.customerId ? (links.get(t.customerId)?.email ?? null) : null,
      ),
    );

    return NextResponse.json({ transactions });
  } catch (error) {
    log.withError(error).error("admin paddle list transactions failed");

    return apiError(Status.BadGateway, "failed to list transactions");
  }
}
