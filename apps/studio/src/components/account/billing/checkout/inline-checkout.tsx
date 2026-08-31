"use client";

import { useIntlayer } from "next-intlayer";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  makeBillingSuccessUrl,
  makePricingUrl,
} from "@wowlab/shared/lib/links";
import { mountInlineCheckout } from "@wowlab/shared/lib/paddle/client";

import { OrderSummary } from "./order-summary";

const FRAME_TARGET = "wowlab-paddle-inline-checkout";

type InlineCheckoutProps = {
  customerAuthToken: string | null;
  discount?: string;
  email: string;
  locale: string;
  plan?: "guild" | "individual";
  priceId?: string;
  quantity: number;
  userId: string;
};

export function InlineCheckout({
  customerAuthToken,
  discount,
  email,
  locale,
  plan,
  priceId,
  quantity,
  userId,
}: Readonly<InlineCheckoutProps>) {
  const content = useIntlayer("checkoutPage");

  useEffect(() => {
    if (!priceId) {
      return;
    }

    void mountInlineCheckout({
      containerClassName: FRAME_TARGET,
      customerAuthToken: customerAuthToken ?? undefined,
      discountCode: discount,
      email,
      locale,
      plan,
      priceId,
      quantity,
      successUrl: makeBillingSuccessUrl(),
      theme: "light",
      userId,
    });
  }, [
    customerAuthToken,
    discount,
    email,
    locale,
    plan,
    priceId,
    quantity,
    userId,
  ]);

  if (!priceId) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          {content.noItemSelected}
        </p>
        <Button asChild size="sm">
          <Link href={makePricingUrl()}>{content.viewPlans}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-xl bg-white p-4 shadow-2xl ring-1 ring-black/5">
        <div className={FRAME_TARGET} />
      </div>
      <OrderSummary plan={plan} priceId={priceId} quantity={quantity} />
    </div>
  );
}
