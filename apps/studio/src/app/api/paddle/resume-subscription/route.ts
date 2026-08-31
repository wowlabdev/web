import { type NextRequest, NextResponse } from "next/server";

import { withSubscriptionOwnership } from "@/lib/paddle/ownership";
import { resumeSubscription } from "@/lib/paddle/subscriptions";
import { parse, SubscriptionOwnershipSchema } from "@/lib/zod";
import { apiError, Status } from "@wowlab/shared/lib/api/response";

export async function POST(request: NextRequest) {
  return withSubscriptionOwnership<null>(request, {
    execute: async ({ subscriptionId }) => {
      await resumeSubscription(subscriptionId);

      return NextResponse.json({ ok: true });
    },
    failureLog: "paddle resume failed",
    failureMessage: "resume failed",
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
