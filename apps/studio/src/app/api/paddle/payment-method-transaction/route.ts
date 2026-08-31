import { type NextRequest, NextResponse } from "next/server";

import { withSubscriptionOwnership } from "@/lib/paddle/ownership";
import { getPaymentMethodTransactionId } from "@/lib/paddle/subscriptions";
import { parse, SubscriptionOwnershipSchema } from "@/lib/zod";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function POST(request: NextRequest) {
  return withSubscriptionOwnership<null>(request, {
    execute: async ({ subscriptionId }) => {
      const transactionId = await getPaymentMethodTransactionId(subscriptionId);

      return NextResponse.json({ transactionId });
    },
    failureLog: "paddle payment method transaction failed",
    failureMessage: "failed to get payment method transaction",
    validate: (body) => {
      const input = parse(SubscriptionOwnershipSchema, body);

      if (!input) {
        return {
          ok: false,
          response: apiError(Status.BadRequest, "missing subscriptionId"),
        };
      }

      return { data: null, ok: true, subscriptionId: input.subscriptionId };
    },
  });
}
