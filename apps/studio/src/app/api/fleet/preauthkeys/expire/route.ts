import { connection, type NextRequest, NextResponse } from "next/server";

import { expirePreAuthKey } from "@/lib/headscale/client";
import { ExpirePreAuthKeySchema, parse } from "@/lib/zod";
import { requireAdmin } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function POST(request: NextRequest) {
  await connection();

  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const body = parse(
    ExpirePreAuthKeySchema,
    await request.json().catch(() => ({})),
  );

  if (!body) {
    return apiError(Status.BadRequest, "userId and key are required");
  }

  try {
    await expirePreAuthKey(body.userId, body.key);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return apiError(Status.BadGateway, message);
  }
}
