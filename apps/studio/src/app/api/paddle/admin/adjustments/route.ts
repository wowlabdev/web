import type {
  AdjustmentAction,
  AdjustmentStatus,
} from "@paddle/paddle-node-sdk";
import type { CreateAdjustmentRequestBody } from "@paddle/paddle-node-sdk";

import { connection, type NextRequest, NextResponse } from "next/server";

import { log } from "@/lib/observability";
import { paddle } from "@/lib/paddle/server";
import { AdminCreateAdjustmentSchema, parse } from "@/lib/zod";
import { requireAdmin } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export type AdminAdjustment = {
  action: AdjustmentAction;
  createdAt: string;
  currencyCode: string;
  id: string;
  reason: string | null;
  status: AdjustmentStatus;
  totalMinor: string;
  transactionId: string;
};

export async function POST(request: NextRequest) {
  await connection();

  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const raw = (await request.json().catch(() => ({}))) as unknown;
  const body = parse(AdminCreateAdjustmentSchema, raw);

  if (!body) {
    return apiError(Status.BadRequest, "invalid body");
  }

  const items = body.items ?? [];
  const allFull = items.every((item) => item.type === "full");

  const requestBody: CreateAdjustmentRequestBody = allFull
    ? {
        action: body.action,
        reason: body.reason,
        transactionId: body.transactionId,
        type: "full",
      }
    : {
        action: body.action,
        items: items.map((item) => ({
          amount: item.amount ?? null,
          itemId: item.itemId,
          type: item.type,
        })),
        reason: body.reason,
        transactionId: body.transactionId,
        type: "partial",
      };

  try {
    const adj = await paddle.adjustments.create(requestBody);

    const result: AdminAdjustment = {
      action: adj.action,
      createdAt: adj.createdAt,
      currencyCode: adj.currencyCode,
      id: adj.id,
      reason: adj.reason,
      status: adj.status,
      totalMinor: adj.totals.total,
      transactionId: adj.transactionId,
    };

    return NextResponse.json({ adjustment: result });
  } catch (error) {
    log
      .withMetadata({ transactionId: body.transactionId })
      .withError(error)
      .error("admin paddle create adjustment failed");

    return apiError(Status.BadGateway, "adjustment failed");
  }
}
