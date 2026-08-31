import { connection, NextResponse } from "next/server";

import { deleteNode } from "@/lib/headscale/client";
import { requireAdmin } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function DELETE(
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
    await deleteNode(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return apiError(Status.BadGateway, message);
  }
}
