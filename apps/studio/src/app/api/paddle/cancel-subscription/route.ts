import { type NextRequest, NextResponse } from "next/server";

import { withSubscriptionOwnership } from "@/lib/paddle/ownership";
import { cancelSubscription } from "@/lib/paddle/subscriptions";
import { CancelSubscriptionSchema, parse } from "@/lib/zod";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function POST(request: NextRequest) {
  return withSubscriptionOwnership<{ immediate: boolean }>(request, {
    execute: async ({ data, subscriptionId }) => {
      await cancelSubscription(subscriptionId, data.immediate);

      return NextResponse.json({ ok: true });
    },
    failureLog: "paddle cancel failed",
    failureMessage: "cancel failed",
    validate: (body) => {
      const input = parse(CancelSubscriptionSchema, body);

      if (!input) {
        return {
          ok: false,
          response: apiError(Status.BadRequest, "missing subscriptionId"),
        };
      }

      return {
        data: { immediate: input.immediate },
        ok: true,
        subscriptionId: input.subscriptionId,
      };
    },
  });
}
