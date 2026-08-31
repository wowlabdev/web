"use client";

import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Badge, type BadgeVariant } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { Link } from "@wowlab/shared/components/ui/link";
import { makeBillingUrl, makePricingUrl } from "@wowlab/shared/lib/links";
type DashboardPlanCardProps = {
  planLabel: string;
  planKey: string | null;
  statusKey: string | null | undefined;
  statusVariant: BadgeVariant;
  quantity: number | null;
  isSubscribed: boolean;
};

export function DashboardPlanCard({
  isSubscribed,
  planKey,
  planLabel,
  quantity,
  statusKey,
  statusVariant,
}: Readonly<DashboardPlanCardProps>) {
  const content = useIntlayer("accountPage");
  const showSlots = isSubscribed && planKey === "guild" && quantity != null;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 py-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
              <SparklesIcon className="size-4" />
            </div>
            <span className="text-sm font-medium">
              {content.dashboardPlanLabel}
            </span>
          </div>
          {isSubscribed && statusKey ? (
            <Badge variant={statusVariant}>{statusKey}</Badge>
          ) : (
            <Badge variant="outline">{content.dashboardPlanFree}</Badge>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold">{planLabel}</span>
          {showSlots && (
            <span className="text-muted-foreground text-sm">
              {content.dashboardPlanSlotsLabel(quantity)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {isSubscribed ? (
            <Button asChild size="sm" variant="outline">
              <Link href={makeBillingUrl()}>
                {content.dashboardPlanManage}
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm">
              <a href={makePricingUrl()}>
                {content.dashboardPlanUpgrade}
                <ArrowRightIcon className="size-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
