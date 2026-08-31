import { connection, NextResponse } from "next/server";

import { loadFleet } from "@/lib/headscale/fleet";
import { requireAdmin } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function GET() {
  await connection();

  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    return NextResponse.json(await loadFleet());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return apiError(Status.BadGateway, message);
  }
}
