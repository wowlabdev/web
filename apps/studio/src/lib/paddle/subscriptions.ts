import "server-only";

import { createAdminClient } from "@wowlab/shared/lib/supabase/admin";

import { paddle } from "./server";

export async function cancelSubscription(
  subscriptionId: string,
  immediate: boolean,
) {
  await paddle.subscriptions.cancel(subscriptionId, {
    effectiveFrom: immediate ? "immediately" : "next_billing_period",
  });
}

export async function getPaymentMethodTransactionId(
  subscriptionId: string,
): Promise<string> {
  const txn =
    await paddle.subscriptions.getPaymentMethodChangeTransaction(
      subscriptionId,
    );

  return txn.id;
}

export async function pauseSubscription(
  subscriptionId: string,
  immediate: boolean,
) {
  await paddle.subscriptions.pause(subscriptionId, {
    effectiveFrom: immediate ? "immediately" : "next_billing_period",
  });
}

export async function resumeSubscription(subscriptionId: string) {
  await paddle.subscriptions.resume(subscriptionId, {
    effectiveFrom: "immediately",
  });
}

export async function updateSubscription(
  subscriptionId: string,
  priceId: string,
  quantity: number,
) {
  await paddle.subscriptions.update(subscriptionId, {
    items: [{ priceId, quantity }],
    prorationBillingMode: "prorated_immediately",
  });
}

export async function userOwnsSubscription(
  userId: string,
  subscriptionId: string,
): Promise<boolean> {
  const { data } = await createAdminClient()
    .from("subscriptions")
    .select("supabase_user_id")
    .eq("paddle_subscription_id", subscriptionId)
    .maybeSingle();

  return !!data && data.supabase_user_id === userId;
}
