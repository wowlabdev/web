"use client";

import { CheckIcon, ChevronDownIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@wowlab/shared/components/ui/popover";
import {
  MAX_GUILD_SLOTS,
  MIN_GUILD_SLOTS,
  SLOT_RATE,
} from "@wowlab/shared/lib/billing/constants";
import { env } from "@wowlab/shared/lib/env";

import { CheckoutButton } from "./checkout-button";
import { PriceDisplay } from "./price-display";

export function GuildPlanCard() {
  const content = useIntlayer("pricingPage");
  const [slots, setSlots] = useState(MIN_GUILD_SLOTS);
  const price = slots * SLOT_RATE;

  const features = [
    { key: "guild-1", label: content.guildFeature1 },
    { key: "guild-2", label: content.guildFeature2 },
    { key: "guild-3", label: content.guildFeature3 },
    { key: "guild-4", label: content.guildFeature4 },
    { key: "guild-5", label: content.guildFeature5 },
    { key: "guild-6", label: content.guildFeature6 },
  ];

  return (
    <Card>
      <CardContent className="grid h-full grid-rows-[5rem_3rem_auto_1fr] gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">{content.guildName}</h3>
          <p className="text-muted-foreground min-h-10 text-xs">
            {content.guildDescription}
          </p>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <PriceDisplay
              amount={price}
              prefix="$"
              suffix={content.guildPriceSuffix}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <span className="tabular-nums">{slots}</span>{" "}
                {slots === 1 ? content.slotLabel : content.slotsLabel}
                <ChevronDownIcon className="ml-1 size-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60">
              <div className="space-y-2">
                <div className="text-xs font-medium">
                  {content.concurrentSimsLabel}
                </div>
                <div className="flex items-center justify-between gap-2 rounded-none border p-1">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() =>
                      setSlots(Math.max(MIN_GUILD_SLOTS, slots - 1))
                    }
                    disabled={slots <= MIN_GUILD_SLOTS}
                    aria-label={content.slotsDecreaseAriaLabel.value}
                  >
                    <MinusIcon className="size-3.5" />
                  </Button>
                  <span className="text-sm font-medium tabular-nums">
                    {slots}
                  </span>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() =>
                      setSlots(Math.min(MAX_GUILD_SLOTS, slots + 1))
                    }
                    disabled={slots >= MAX_GUILD_SLOTS}
                    aria-label={content.slotsIncreaseAriaLabel.value}
                  >
                    <PlusIcon className="size-3.5" />
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  {content.slotPricingHint({
                    min: MIN_GUILD_SLOTS,
                    rate: SLOT_RATE,
                  })}
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <CheckoutButton
          plan="guild"
          priceId={env.PADDLE_PRICE_GUILD_SLOT}
          quantity={slots}
        >
          {content.guildCta}
        </CheckoutButton>

        <div className="space-y-2 border-t pt-3">
          {features.map((feature) => (
            <div key={feature.key} className="flex items-start gap-2 text-xs">
              <CheckIcon className="text-foreground mt-0.5 size-3.5 shrink-0" />
              <span className="font-medium">{feature.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
