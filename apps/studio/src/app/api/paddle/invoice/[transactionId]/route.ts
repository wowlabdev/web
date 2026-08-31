import { connection, type NextRequest, NextResponse } from "next/server";

import { log } from "@/lib/observability";
import { getUserInvoicePdfUrl } from "@/lib/paddle/transactions";
import { requireUser } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

type Params = { params: Promise<{ transactionId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  await connection();

  const auth = await requireUser();

  if (!auth.ok) {
    return auth.response;
  }

  const { transactionId } = await params;

  try {
    const url = await getUserInvoicePdfUrl(auth.claims.sub, transactionId);

    if (!url) {
      return apiError(Status.NotFound, "not found");
    }

    return NextResponse.redirect(url);
  } catch (error) {
    log.withError(error).error("paddle invoice fetch failed");

    return apiError(Status.BadGateway, "invoice unavailable");
  }
}
