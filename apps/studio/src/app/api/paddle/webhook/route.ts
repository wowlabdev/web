import { connection, type NextRequest, NextResponse } from "next/server";

import { log } from "@/lib/observability";
import { dispatchPaddleEvent } from "@/lib/paddle/dispatch";
import { paddle } from "@/lib/paddle/server";
import { apiError, Status } from "@wowlab/shared/lib/api/response";
import { createAdminClient } from "@wowlab/shared/lib/supabase/admin";

export async function POST(request: NextRequest) {
  await connection();

  const signature = request.headers.get("paddle-signature");
  const raw = await request.text();

  if (!signature || !raw) {
    return apiError(Status.BadRequest, "missing signature");
  }

  let event;

  try {
    event = await paddle.webhooks.unmarshal(
      raw,
      process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET!,
      signature,
    );
  } catch {
    return apiError(Status.Unauthorized, "invalid signature");
  }

  try {
    await dispatchPaddleEvent(event, createAdminClient());
  } catch (error) {
    log.withError(error).error("paddle dispatch failed");

    return apiError(Status.InternalError, "dispatch failed");
  }

  return NextResponse.json({ ok: true });
}
