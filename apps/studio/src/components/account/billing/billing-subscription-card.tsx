"use client";

import {
  CreditCardIcon,
  ExternalLinkIcon,
  PauseIcon,
  PlayIcon,
  XCircleIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";

import type { Row } from "@wowlab/shared/lib/supabase/types";

import {
  Skeleton,
  SkeletonCard,
} from "@wowlab/shared/components/common/skeleton-blocks";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@wowlab/shared/components/ui/card";
import { STATUS_VARIANTS } from "@wowlab/shared/lib/billing/constants";
import { makePricingUrl } from "@wowlab/shared/lib/links";
type BillingSubscriptionCardProps = {
  subscription: Row<"subscriptions"> | null | undefined;
  isLoading: boolean;
  isPaymentMethodPending: boolean;
  isResumePending: boolean;
  onUpdatePaymentMethod: () => void;
  onChangeSlots: () => void;
  onResume: () => void;
  onPause: () => void;
  onCancel: () => void;
};

export function BillingSubscriptionCard({
  isLoading,
  isPaymentMethodPending,
  isResumePending,
  onCancel,
  onChangeSlots,
  onPause,
  onResume,
  onUpdatePaymentMethod,
  subscription,
}: Readonly<BillingSubscriptionCardProps>) {
  const formatDate = useDate();
  const content = useIntlayer("accountPage");
  const formatIsoDate = (iso: string | null): string =>
    iso ? formatDate(new Date(iso), { dateStyle: "medium" }) : "-";

  if (isLoading) {
    return <BillingSubscriptionCardSkeleton />;
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-3 py-6">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {content.billingNoSubscriptionTitle}
            </p>
            <p className="text-muted-foreground text-sm">
              {content.billingNoSubscriptionDescription}
            </p>
          </div>
          <Button asChild size="sm">
            <a href={makePricingUrl()}>
              {content.billingViewPlans}
              <ExternalLinkIcon className="size-3.5" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const resolvePlanLabel = () => {
    if (subscription.plan === "guild") {
      return content.planLabelGuild.value;
    }

    if (subscription.plan === "individual") {
      return content.planLabelIndividual.value;
    }

    return subscription.plan;
  };
  const planLabel = resolvePlanLabel();
  const statusVariant = STATUS_VARIANTS[subscription.status] ?? "secondary";
  const canCancel =
    subscription.status !== "canceled" && !subscription.scheduled_change_action;
  const canPause =
    subscription.status === "active" && !subscription.scheduled_change_action;
  const canResume =
    subscription.status === "paused" ||
    subscription.scheduled_change_action === "pause";
  const canChangeSlots =
    subscription.plan === "guild" && subscription.status === "active";
  const isGuild = subscription.plan === "guild";
  const slotsCount = subscription.quantity;

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold">{planLabel}</span>
          <Badge variant={statusVariant}>{subscription.status}</Badge>
        </div>
        <span className="text-muted-foreground text-sm tabular-nums">
          {isGuild ? content.billingSlotsLabel(slotsCount) : slotsCount}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs">
              {content.billingSubscriptionNextBilled}
            </span>
            <span className="tabular-nums">
              {formatIsoDate(subscription.next_billed_at)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs">
              {content.billingSubscriptionCurrentPeriodEnds}
            </span>
            <span className="tabular-nums">
              {formatIsoDate(subscription.current_period_ends_at)}
            </span>
          </div>
          {subscription.canceled_at && (
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs">
                {content.billingSubscriptionCanceledLabel}
              </span>
              <span className="tabular-nums">
                {formatIsoDate(subscription.canceled_at)}
              </span>
            </div>
          )}
          {subscription.scheduled_change_action && (
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs">
                {content.billingScheduledLabel}
              </span>
              <span className="tabular-nums">
                {subscription.scheduled_change_action}
                {subscription.scheduled_change_effective_at
                  ? content.billingScheduledOn({
                      date: formatIsoDate(
                        subscription.scheduled_change_effective_at,
                      ),
                    })
                  : ""}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t pt-3">
          <Button
            variant="outline"
            size="sm"
            loading={isPaymentMethodPending}
            onClick={onUpdatePaymentMethod}
          >
            {!isPaymentMethodPending && <CreditCardIcon className="size-3.5" />}
            {isPaymentMethodPending
              ? content.billingActionUpdatePaymentMethodLoading
              : content.billingActionUpdatePaymentMethod}
          </Button>
          {canChangeSlots && (
            <Button variant="outline" size="sm" onClick={onChangeSlots}>
              {content.billingChangeSlotsTrigger}
            </Button>
          )}
          {canResume && (
            <Button
              variant="outline"
              size="sm"
              loading={isResumePending}
              onClick={onResume}
            >
              {!isResumePending && <PlayIcon className="size-3.5" />}
              {isResumePending
                ? content.billingActionResuming
                : content.billingActionResume}
            </Button>
          )}
          {canPause && (
            <Button variant="outline" size="sm" onClick={onPause}>
              <PauseIcon className="size-3.5" />
              {content.billingActionPause}
            </Button>
          )}
          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-destructive/10! text-destructive! border-destructive!"
              onClick={onCancel}
            >
              <XCircleIcon className="size-3.5" />
              {content.billingCancelTrigger}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BillingSubscriptionCardSkeleton() {
  return (
    <SkeletonCard headerWidth="w-32">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t pt-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </SkeletonCard>
  );
}
