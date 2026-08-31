"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import {
  BOOST_RATE,
  BOOST_STEP,
  MAX_BOOSTS,
  MIN_BOOSTS,
} from "@wowlab/shared/lib/billing/constants";
import { env } from "@wowlab/shared/lib/env";

import { CheckoutButton } from "./checkout-button";
import { PriceDisplay } from "./price-display";

export function BoostPackSelector() {
  const content = useIntlayer("pricingPage");
  const [boosts, setBoosts] = useState(MIN_BOOSTS);
  const price = boosts * BOOST_RATE;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-2 rounded-none border p-1 sm:w-48">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => setBoosts(Math.max(MIN_BOOSTS, boosts - BOOST_STEP))}
            disabled={boosts <= MIN_BOOSTS}
            aria-label={content.boostsDecreaseAriaLabel.value}
          >
            <MinusIcon className="size-3.5" />
          </Button>
          <span className="text-xs font-medium tabular-nums">
            {boosts} {content.boostsLabel}
          </span>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => setBoosts(Math.min(MAX_BOOSTS, boosts + BOOST_STEP))}
            disabled={boosts >= MAX_BOOSTS}
            aria-label={content.boostsIncreaseAriaLabel.value}
          >
            <PlusIcon className="size-3.5" />
          </Button>
        </div>

        <div className="flex items-baseline gap-1 sm:ml-auto">
          <PriceDisplay
            amount={price}
            prefix="$"
            suffix={content.boostPriceSuffix}
            size="2xl"
          />
        </div>

        <CheckoutButton priceId={env.PADDLE_PRICE_BOOST_PACK} quantity={boosts}>
          {content.buyBoostsCta}
        </CheckoutButton>
      </CardContent>
    </Card>
  );
}
