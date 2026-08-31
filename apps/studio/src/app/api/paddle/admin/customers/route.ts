import type { Status as PaddleStatus } from "@paddle/paddle-node-sdk";

import { connection, type NextRequest, NextResponse } from "next/server";

import { log } from "@/lib/observability";
import { getPaddleCustomerLinks } from "@/lib/paddle/customers";
import { clampPerPage } from "@/lib/paddle/pagination";
import { paddle } from "@/lib/paddle/server";
import { requireAdmin } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export type AdminCustomer = {
  createdAt: string;
  email: string | null;
  id: string;
  name: string | null;
  status: PaddleStatus;
  supabaseUserId: string | null;
};

export async function GET(request: NextRequest) {
  await connection();

  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const search = request.nextUrl.searchParams.get("search") ?? undefined;
  const perPage = clampPerPage(
    request.nextUrl.searchParams.get("perPage"),
    50,
    200,
  );

  try {
    const page = await paddle.customers
      .list({
        ...(search ? { search } : {}),
        perPage,
      })
      .next();

    const links = await getPaddleCustomerLinks(page.map((c) => c.id));

    const customers: AdminCustomer[] = page.map((c) => ({
      createdAt: c.createdAt,
      email: c.email,
      id: c.id,
      name: c.name,
      status: c.status,
      supabaseUserId: links.get(c.id)?.supabaseUserId ?? null,
    }));

    return NextResponse.json({ customers });
  } catch (error) {
    log.withError(error).error("admin paddle list customers failed");

    return apiError(Status.BadGateway, "failed to list customers");
  }
}
