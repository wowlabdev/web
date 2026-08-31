"use client";

import { useMemoizedFn, useRequest } from "ahooks";
import { ArrowLeftIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { getQuantityBounds } from "@wowlab/shared/lib/billing/constants";
import {
  makeBillingUrl,
  makePricingUrl,
  makeRefundPolicyUrl,
} from "@wowlab/shared/lib/links";
import {
  previewPrice,
  updateCheckoutItems,
} from "@wowlab/shared/lib/paddle/client";

import {
  BILLING_CYCLE_KEYS,
  hasCheckoutDiscount,
  resolvePriceLabelKey,
  TRIAL_PERIOD_KEYS,
} from "./order-summary-labels";
import { OrderSummaryQuantity } from "./order-summary-quantity";
import { OrderSummaryRow } from "./order-summary-row";

type OrderSummaryProps = {
  plan?: "guild" | "individual";
  priceId: string;
  quantity: number;
};

export function OrderSummary({
  plan,
  priceId,
  quantity,
}: Readonly<OrderSummaryProps>) {
  const content = useIntlayer("checkoutPage");
  const [currentQty, setCurrentQty] = useState(quantity);
  const bounds = getQuantityBounds(priceId);

  const { data: preview } = useRequest(
    () => previewPrice(priceId, currentQty),
    { refreshDeps: [priceId, currentQty] },
  );

  const handleQtyChange = useMemoizedFn((next: number) => {
    if (!bounds) {
      return;
    }

    const clamped = Math.max(bounds.min, Math.min(bounds.max, next));

    if (clamped === currentQty) {
      return;
    }

    setCurrentQty(clamped);
    void updateCheckoutItems(priceId, clamped);
  });

  const cycleLabel = preview?.billingCycle
    ? content[BILLING_CYCLE_KEYS[preview.billingCycle.interval]]({
        count: preview.billingCycle.frequency,
        frequency: preview.billingCycle.frequency,
      }).value
    : content.oneTimePayment.value;
  const trialLabel = preview?.trialPeriod
    ? content[TRIAL_PERIOD_KEYS[preview.trialPeriod.interval]]({
        count: preview.trialPeriod.frequency,
        frequency: preview.trialPeriod.frequency,
      }).value
    : null;
  const discount = preview?.discount;

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">{content.orderSummaryTitle}</h3>
          <p className="text-muted-foreground text-xs">
            {content.orderSummaryDescription}
          </p>
        </div>

        <div className="space-y-3 border-t pt-3">
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-sm font-medium">
              {content[resolvePriceLabelKey(priceId, plan)]}
            </div>
            <div className="text-sm tabular-nums">
              {preview?.subtotal ?? "…"}
            </div>
          </div>

          {bounds ? (
            <div className="flex items-center justify-between gap-2">
              <div className="text-muted-foreground text-xs">
                {content.quantity}
              </div>
              <OrderSummaryQuantity
                bounds={bounds}
                onChange={handleQtyChange}
                value={currentQty}
              />
            </div>
          ) : (
            <div className="text-muted-foreground text-xs tabular-nums">
              {content.quantityInline({ count: currentQty })}
            </div>
          )}

          {hasCheckoutDiscount(discount) && (
            <OrderSummaryRow
              label={content.discount.value}
              value={`−${discount}`}
              valueClassName="text-foreground"
            />
          )}

          <OrderSummaryRow
            label={content.tax.value}
            value={preview?.tax ?? "…"}
          />

          <div className="flex items-baseline justify-between gap-2 border-t pt-2">
            <div className="text-sm font-semibold">{content.total}</div>
            <div className="text-right">
              <div className="text-lg font-semibold tabular-nums">
                {preview?.total ?? "…"}
              </div>
              {preview && (
                <div className="text-muted-foreground text-[11px]">
                  {preview.currencyCode}
                </div>
              )}
            </div>
          </div>

          <p className="text-muted-foreground border-t pt-2 text-xs">
            {cycleLabel}
            {trialLabel ? content.trialSuffix({ trial: trialLabel }) : ""}.
          </p>
        </div>

        <p className="text-muted-foreground text-xs">
          {content.refundPolicyPrefix}
          <Link
            className="underline underline-offset-2"
            href={makeRefundPolicyUrl()}
            rel="noopener noreferrer"
            target="_blank"
          >
            {content.refundPolicyLink}
          </Link>
          {content.refundPolicySuffix}
        </p>

        <Button asChild className="w-full" size="sm" variant="outline">
          <Link href={makePricingUrl()}>
            <ArrowLeftIcon className="size-4" />
            {content.backToPlans}
          </Link>
        </Button>
        <Button asChild className="w-full" size="sm" variant="ghost">
          <Link href={makeBillingUrl()}>
            <ArrowLeftIcon className="size-4" />
            {content.backToBilling}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
