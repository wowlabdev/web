import { connection, type NextRequest, NextResponse } from "next/server";

import { log } from "@/lib/observability";
import { updateSubscription } from "@/lib/paddle/subscriptions";
import { AdminUpdateSubscriptionSchema, parse } from "@/lib/zod";
import { requireAdmin } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connection();

  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;

  const raw = (await request.json().catch(() => ({}))) as unknown;
  const body = parse(AdminUpdateSubscriptionSchema, raw);

  if (!body) {
    return apiError(Status.BadRequest, "invalid body");
  }

  try {
    await updateSubscription(id, body.priceId, body.quantity);

    return NextResponse.json({ ok: true });
  } catch (error) {
    log
      .withMetadata({ id })
      .withError(error)
      .error("admin paddle update failed");

    return apiError(Status.BadGateway, "update failed");
  }
}
