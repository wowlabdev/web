import { connection, NextResponse } from "next/server";

import { log } from "@/lib/observability";
import { listUserBillingTransactions } from "@/lib/paddle/transactions";
import { requireUser } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function GET() {
  await connection();

  const auth = await requireUser();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const transactions = await listUserBillingTransactions(auth.claims.sub);

    return NextResponse.json({ transactions });
  } catch (error) {
    log.withError(error).error("paddle list transactions failed");

    return apiError(Status.BadGateway, "failed to list transactions");
  }
}
