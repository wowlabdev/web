import type { BillingInterval } from "@wowlab/shared/lib/paddle/client";

import { env } from "@wowlab/shared/lib/env";

export const BILLING_CYCLE_KEYS = {
  day: "billingCycleDay",
  month: "billingCycleMonth",
  week: "billingCycleWeek",
  year: "billingCycleYear",
} as const satisfies Record<BillingInterval, string>;

export const TRIAL_PERIOD_KEYS = {
  day: "trialPeriodDay",
  month: "trialPeriodMonth",
  week: "trialPeriodWeek",
  year: "trialPeriodYear",
} as const satisfies Record<BillingInterval, string>;

type PriceLabelKey =
  | "priceLabelBoostPack"
  | "priceLabelGuildSlots"
  | "priceLabelIndividualPlan"
  | "priceLabelPlan";

const PRICE_LABEL_KEYS: Partial<Record<string, PriceLabelKey>> = {
  [env.PADDLE_PRICE_BOOST_PACK]: "priceLabelBoostPack",
  [env.PADDLE_PRICE_GUILD_SLOT]: "priceLabelGuildSlots",
  [env.PADDLE_PRICE_INDIVIDUAL]: "priceLabelIndividualPlan",
};

export function hasCheckoutDiscount(
  discount: null | string | undefined,
): discount is string {
  return (
    discount != null &&
    discount !== "" &&
    !discount.startsWith("$0") &&
    discount !== "0"
  );
}

export function resolvePriceLabelKey(
  priceId: string,
  plan: "guild" | "individual" | undefined,
): PriceLabelKey {
  const configuredLabel = PRICE_LABEL_KEYS[priceId];

  if (configuredLabel) {
    return configuredLabel;
  }

  return plan === "guild" ? "priceLabelGuildSlots" : "priceLabelPlan";
}
