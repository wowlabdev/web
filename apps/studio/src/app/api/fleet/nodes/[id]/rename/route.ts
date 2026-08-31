import { connection, type NextRequest, NextResponse } from "next/server";

import { renameNode } from "@/lib/headscale/client";
import { parse, RenameNodeSchema } from "@/lib/zod";
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
  const body = parse(RenameNodeSchema, await request.json().catch(() => ({})));

  if (!body) {
    return apiError(Status.BadRequest, "newName is required");
  }

  try {
    const node = await renameNode(id, body.newName);

    return NextResponse.json({ node });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return apiError(Status.BadGateway, message);
  }
}
