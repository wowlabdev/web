import { connection, type NextRequest, NextResponse } from "next/server";

import { createPreAuthKey } from "@/lib/headscale/client";
import { CreatePreAuthKeySchema, parse } from "@/lib/zod";
import { requireAdmin } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function POST(request: NextRequest) {
  await connection();

  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const body = parse(
    CreatePreAuthKeySchema,
    await request.json().catch(() => ({})),
  );

  if (!body) {
    return apiError(Status.BadRequest, "userId and expiration are required");
  }

  try {
    const preAuthKey = await createPreAuthKey({
      aclTags: body.aclTags,
      ephemeral: body.ephemeral,
      expiration: body.expiration,
      reusable: body.reusable,
      userId: body.userId,
    });

    return NextResponse.json({ preAuthKey });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return apiError(Status.BadGateway, message);
  }
}
