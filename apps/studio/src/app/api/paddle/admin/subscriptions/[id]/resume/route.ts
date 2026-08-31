import { connection, type NextRequest, NextResponse } from "next/server";

import { log } from "@/lib/observability";
import { resumeSubscription } from "@/lib/paddle/subscriptions";
import { requireAdmin } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function POST(
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
    await resumeSubscription(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    log
      .withMetadata({ id })
      .withError(error)
      .error("admin paddle resume failed");

    return apiError(Status.BadGateway, "resume failed");
  }
}
