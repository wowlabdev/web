import "server-only";
import { connection, type NextRequest, NextResponse } from "next/server";

import { log } from "@/lib/observability";
import { requireUser } from "@wowlab/shared/lib/api/auth";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

import { userOwnsSubscription } from "./subscriptions";

type SubscriptionOwnershipHandler<T> = {
  execute: (input: {
    subscriptionId: string;
    data: T;
  }) => Promise<NextResponse>;
  failureLog: string;
  failureMessage: string;
  validate: (body: unknown) => Validation<T>;
};

type Validation<T> =
  | { ok: true; subscriptionId: string; data: T }
  | { ok: false; response: NextResponse };

export async function withSubscriptionOwnership<T>(
  request: NextRequest,
  handler: SubscriptionOwnershipHandler<T>,
): Promise<NextResponse> {
  await connection();

  const auth = await requireUser();

  if (!auth.ok) {
    return auth.response;
  }

  const body = await request.json().catch(() => ({}));
  const validation = handler.validate(body);

  if (!validation.ok) {
    return validation.response;
  }

  const { data, subscriptionId } = validation;

  if (!(await userOwnsSubscription(auth.claims.sub, subscriptionId))) {
    return apiError(Status.NotFound, "not found");
  }

  try {
    return await handler.execute({ data, subscriptionId });
  } catch (error) {
    log.withError(error).error(handler.failureLog);

    return apiError(Status.BadGateway, handler.failureMessage);
  }
}
