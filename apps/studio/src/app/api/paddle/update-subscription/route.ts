import { type NextRequest, NextResponse } from "next/server";

import { withSubscriptionOwnership } from "@/lib/paddle/ownership";
import { updateSubscription } from "@/lib/paddle/subscriptions";
import { parse, UpdateSubscriptionSchema } from "@/lib/zod";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function POST(request: NextRequest) {
  return withSubscriptionOwnership<{ priceId: string; quantity: number }>(
    request,
    {
      execute: async ({ data, subscriptionId }) => {
        await updateSubscription(subscriptionId, data.priceId, data.quantity);

        return NextResponse.json({ ok: true });
      },
      failureLog: "paddle update failed",
      failureMessage: "update failed",
      validate: (body) => {
        const input = parse(UpdateSubscriptionSchema, body);

        if (!input) {
          return {
            ok: false,
            response: apiError(
              Status.BadRequest,
              "missing subscriptionId, priceId, or quantity",
            ),
          };
        }

        return {
          data: { priceId: input.priceId, quantity: input.quantity },
          ok: true,
          subscriptionId: input.subscriptionId,
        };
      },
    },
  );
}
