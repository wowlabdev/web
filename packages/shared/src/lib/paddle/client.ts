"use client";

import { initializePaddle, type Paddle } from "@paddle/paddle-js";

import { env } from "@wowlab/shared/lib/env";

let promise: Promise<Paddle | undefined> | null = null;

export type BillingInterval = "day" | "week" | "month" | "year";

export type PricePreview = {
  billingCycle: { frequency: number; interval: BillingInterval } | null;
  currencyCode: string;
  discount: string;
  subtotal: string;
  tax: string;
  total: string;
  trialPeriod: { frequency: number; interval: BillingInterval } | null;
};

type InlineCheckoutOptions = {
  containerClassName: string;
  customerAuthToken?: string;
  discountCode?: string;
  email?: string;
  locale?: string;
  plan?: "guild" | "individual";
  priceId: string;
  quantity: number;
  successUrl: string;
  theme: "light" | "dark";
  userId: string;
};

export function getPaddle() {
  if (!promise) {
    promise = initializePaddle({
      environment: env.PADDLE_ENV,
      token: env.PADDLE_CLIENT_TOKEN,
    });
  }

  return promise;
}

export async function mountInlineCheckout({
  containerClassName,
  customerAuthToken,
  discountCode,
  email,
  locale,
  plan,
  priceId,
  quantity,
  successUrl,
  theme,
  userId,
}: InlineCheckoutOptions) {
  const paddle = await getPaddle();
  const identity = resolveCheckoutIdentity(customerAuthToken, email);

  paddle?.Checkout.open({
    customData: { supabase_user_id: userId, ...(plan && { plan }) },
    ...identity,
    ...(discountCode && { discountCode }),
    items: [{ priceId, quantity }],
    settings: {
      displayMode: "inline",
      frameInitialHeight: 450,
      frameStyle:
        "width: 100%; min-width: 312px; background-color: transparent; border: none;",
      frameTarget: containerClassName,
      ...(locale && { locale }),
      successUrl,
      theme,
      variant: "one-page",
    },
  });
}

export async function openPaymentMethodCheckout(transactionId: string) {
  const paddle = await getPaddle();

  paddle?.Checkout.open({ transactionId });
}

export async function previewPrice(
  priceId: string,
  quantity: number,
): Promise<PricePreview | null> {
  const paddle = await getPaddle();

  if (!paddle) {
    return null;
  }

  const preview = await paddle.PricePreview({
    items: [{ priceId, quantity }],
  });
  const line = preview.data.details.lineItems[0];

  return {
    billingCycle: line.price.billingCycle,
    currencyCode: preview.data.currencyCode,
    discount: line.formattedTotals.discount,
    subtotal: line.formattedTotals.subtotal,
    tax: line.formattedTotals.tax,
    total: line.formattedTotals.total,
    trialPeriod: line.price.trialPeriod,
  };
}

export async function updateCheckoutItems(priceId: string, quantity: number) {
  const paddle = await getPaddle();

  paddle?.Checkout.updateItems([{ priceId, quantity }]);
}

function resolveCheckoutIdentity(customerAuthToken?: string, email?: string) {
  if (customerAuthToken) {
    return { customerAuthToken };
  }

  if (email) {
    return { customer: { email } };
  }

  return {};
}
