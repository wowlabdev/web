import type { ReactNode } from "react";

import { CheckIcon, XIcon } from "lucide-react";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { makeSimulateUrl } from "@wowlab/shared/lib/links";

import { CheckoutButton } from "./checkout-button";
import { PriceDisplay } from "./price-display";

export type PricingPlan = {
  badge?: ReactNode;
  buttonText: ReactNode;
  checkout?: { plan: "guild" | "individual"; priceId: string };
  description: ReactNode;
  features: Feature[];
  highlighted?: boolean;
  name: ReactNode;
  price: string;
  priceId?: string;
  priceSuffix: ReactNode;
};

type Feature = {
  available: boolean;
  key: string;
  title: ReactNode;
};

type PlanCardProps = {
  plan: PricingPlan;
};

export function PlanCard({ plan }: Readonly<PlanCardProps>) {
  return (
    <Card className={plan.highlighted ? "ring-primary ring-2" : undefined}>
      <CardContent className="grid h-full grid-rows-[5rem_3rem_auto_1fr] gap-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold">{plan.name}</h3>
            {plan.badge ? (
              <Badge className="text-xs" variant="outline">
                {plan.badge}
              </Badge>
            ) : null}
          </div>
          <p className="text-muted-foreground min-h-10 text-xs">
            {plan.description}
          </p>
        </div>

        <div className="flex items-baseline gap-1">
          <PriceDisplay
            amount={plan.price}
            prefix="$"
            suffix={plan.priceSuffix}
            priceId={plan.priceId}
          />
        </div>

        {plan.checkout ? (
          <CheckoutButton
            plan={plan.checkout.plan}
            priceId={plan.checkout.priceId}
            quantity={1}
            variant={plan.highlighted ? "default" : "outline"}
          >
            {plan.buttonText}
          </CheckoutButton>
        ) : (
          <Button
            asChild
            size="sm"
            variant={plan.highlighted ? "default" : "outline"}
          >
            <a href={makeSimulateUrl()}>{plan.buttonText}</a>
          </Button>
        )}

        <div className="space-y-2 border-t pt-3">
          {plan.features.map((feature) => (
            <div className="flex items-start gap-2 text-xs" key={feature.key}>
              {feature.available ? (
                <CheckIcon className="text-foreground mt-0.5 size-3.5 shrink-0" />
              ) : (
                <XIcon className="text-muted-foreground/50 mt-0.5 size-3.5 shrink-0" />
              )}
              <span
                className={
                  feature.available
                    ? "font-medium"
                    : "text-muted-foreground/60 font-medium"
                }
              >
                {feature.title}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
