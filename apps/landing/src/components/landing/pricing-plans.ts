import { env } from "@wowlab/shared/lib/env";

export type PricingPlanConfig = {
  highlighted?: boolean;
  price: string;
  priceId?: string;
};

export const FREE_PLAN: PricingPlanConfig = {
  price: "$0",
};

export const INDIVIDUAL_PLAN: PricingPlanConfig = {
  highlighted: true,
  price: "$9",
  priceId: env.PADDLE_PRICE_INDIVIDUAL,
};
