import "server-only";

import { log } from "@/lib/observability";
import { paddle } from "@/lib/paddle/server";
import { createAdminClient } from "@wowlab/shared/lib/supabase/admin";

export type PaddleCustomerLink = {
  email: string | null;
  supabaseUserId: string | null;
};

export async function generateUserCustomerAuthToken(
  userId: string,
): Promise<string | null> {
  const customerIds = await getUserPaddleCustomerIds(userId);
  const customerId = customerIds[0];

  if (!customerId) {
    return null;
  }

  try {
    const token = await paddle.customers.generateAuthToken(customerId);

    return token.customerAuthToken;
  } catch (error) {
    log.withError(error).error("paddle generateAuthToken failed");

    return null;
  }
}

export async function getPaddleCustomerLinks(
  paddleCustomerIds: readonly string[],
): Promise<Map<string, PaddleCustomerLink>> {
  const map = new Map<string, PaddleCustomerLink>();

  if (paddleCustomerIds.length === 0) {
    return map;
  }

  const ids = [...new Set(paddleCustomerIds)];
  const { data } = await createAdminClient()
    .from("paddle_customers")
    .select("paddle_customer_id, email, supabase_user_id")
    .in("paddle_customer_id", ids);

  for (const row of data ?? []) {
    map.set(row.paddle_customer_id, {
      email: row.email,
      supabaseUserId: row.supabase_user_id,
    });
  }

  return map;
}

export async function getUserPaddleCustomerIds(
  userId: string,
): Promise<string[]> {
  const { data } = await createAdminClient()
    .from("paddle_customers")
    .select("paddle_customer_id")
    .eq("supabase_user_id", userId);

  return (data ?? []).map((c) => c.paddle_customer_id);
}
