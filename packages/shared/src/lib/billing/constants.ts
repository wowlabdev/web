import { type BadgeVariant } from "@wowlab/shared/components/ui/badge";
import { env } from "@wowlab/shared/lib/env";

export type Plan = "guild" | "individual";

export const PRICE_TO_PLAN: Record<string, Plan> = {
  [env.PADDLE_PRICE_GUILD_SLOT]: "guild",
  [env.PADDLE_PRICE_INDIVIDUAL]: "individual",
};

export const PRICE_LABELS: Record<string, string> = {
  [env.PADDLE_PRICE_BOOST_PACK]: "Boost pack",
  [env.PADDLE_PRICE_GUILD_SLOT]: "Guild slots",
  [env.PADDLE_PRICE_INDIVIDUAL]: "Individual plan",
};

export const ADJUSTMENT_STATUS_VARIANTS: Record<string, BadgeVariant> = {
  approved: "default",
  rejected: "destructive",
};

export const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  active: "default",
  canceled: "outline",
  past_due: "destructive",
  paused: "secondary",
  trialing: "secondary",
};

export const TXN_STATUS_VARIANTS: Record<string, BadgeVariant> = {
  billed: "secondary",
  canceled: "outline",
  completed: "default",
  paid: "default",
  past_due: "destructive",
  ready: "secondary",
};

export const SUBSCRIPTION_STATUS_OPTIONS = [
  "active",
  "paused",
  "past_due",
  "canceled",
  "trialing",
] as const;

export const TXN_STATUS_OPTIONS = [
  "completed",
  "paid",
  "billed",
  "past_due",
  "canceled",
] as const;

export const SLOT_RATE = 9;

export const MIN_GUILD_SLOTS = 5;

export const MAX_GUILD_SLOTS = 50;

export const BOOST_RATE = 0.5;

export const MIN_BOOSTS = 10;

export const MAX_BOOSTS = 500;

export const BOOST_STEP = 10;

export type QuantityBounds = { max: number; min: number; step: number };

export function getQuantityBounds(priceId: string): QuantityBounds | null {
  if (priceId === env.PADDLE_PRICE_BOOST_PACK) {
    return { max: MAX_BOOSTS, min: MIN_BOOSTS, step: BOOST_STEP };
  }

  if (priceId === env.PADDLE_PRICE_GUILD_SLOT) {
    return { max: MAX_GUILD_SLOTS, min: MIN_GUILD_SLOTS, step: 1 };
  }

  return null;
}
