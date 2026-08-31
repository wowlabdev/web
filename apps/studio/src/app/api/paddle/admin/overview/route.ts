import { connection, NextResponse } from "next/server";

import { log } from "@/lib/observability";
import { buildAdminOverview } from "@/lib/paddle/overview";
import { collectAll } from "@/lib/paddle/pagination";
import { paddle } from "@/lib/paddle/server";
import { requireAdmin } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function GET() {
  await connection();

  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const ninetyDaysAgo = new Date(
      Date.now() - 90 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const [activeSubs, paidTxns, pastDueTxns] = await Promise.all([
      collectAll(
        paddle.subscriptions.list({ perPage: 100, status: ["active"] }),
      ),
      collectAll(
        paddle.transactions.list({
          "billedAt[GTE]": ninetyDaysAgo,
          perPage: 100,
          status: ["paid", "completed"],
        }),
      ),
      collectAll(
        paddle.transactions.list({
          "billedAt[GTE]": ninetyDaysAgo,
          perPage: 100,
          status: ["past_due"],
        }),
      ),
    ]);

    const overview = buildAdminOverview(activeSubs, paidTxns, pastDueTxns);

    return NextResponse.json(overview);
  } catch (error) {
    log.withError(error).error("admin paddle overview failed");

    return apiError(Status.BadGateway, "overview failed");
  }
}
