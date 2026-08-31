import { connection, NextResponse } from "next/server";

import { expireNode } from "@/lib/headscale/client";
import { requireAdmin } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connection();

  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;

  try {
    const node = await expireNode(id);

    return NextResponse.json({ node });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return apiError(Status.BadGateway, message);
  }
}
