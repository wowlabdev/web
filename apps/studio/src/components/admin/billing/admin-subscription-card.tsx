"use client";

import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";

import type { AdminSubscription } from "@/app/api/paddle/admin/subscriptions/route";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import {
  PRICE_LABELS,
  PRICE_TO_PLAN,
  STATUS_VARIANTS,
} from "@wowlab/shared/lib/billing/constants";

type AdminSubscriptionCardProps = {
  onCancel: (sub: AdminSubscription) => void;
  onChangeSlots: (sub: AdminSubscription) => void;
  onPause: (sub: AdminSubscription) => void;
  onResume: (sub: AdminSubscription) => void;
  subscription: AdminSubscription;
};

export function AdminSubscriptionCard({
  onCancel,
  onChangeSlots,
  onPause,
  onResume,
  subscription: sub,
}: Readonly<AdminSubscriptionCardProps>) {
  const content = useIntlayer("admin");
  const formatDate = useDate();

  const planLabel = PRICE_LABELS[sub.plan] ?? sub.plan;
  const plan = PRICE_TO_PLAN[sub.plan];
  const canCancel = sub.status !== "canceled";
  const canPause = sub.status === "active";
  const canResume = sub.status === "paused" || sub.status === "past_due";
  const canChangeSlots = plan === "guild" && sub.status === "active";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-3">
          <span>{planLabel}</span>
          <Badge variant={STATUS_VARIANTS[sub.status] ?? "secondary"}>
            {sub.status}
          </Badge>
        </CardTitle>
        <span className="text-muted-foreground text-sm tabular-nums">
          {sub.quantity}{" "}
          {plan === "guild" ? content.billingCustomer.slotsSuffix : ""}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs">
              {content.billingCustomer.subscriptionId}
            </span>
            <span className="font-mono">{sub.id}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground text-xs">
              {content.billingCustomer.nextBilled}
            </span>
            <span className="tabular-nums">
              {sub.nextBilledAt
                ? formatDate(new Date(sub.nextBilledAt), {
                    dateStyle: "medium",
                  })
                : "—"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t pt-3">
          {canChangeSlots && (
            <Button
              onClick={() => onChangeSlots(sub)}
              size="sm"
              variant="outline"
            >
              {content.billingCustomer.updateSlots}
            </Button>
          )}
          {canResume && (
            <Button onClick={() => onResume(sub)} size="sm" variant="outline">
              {content.billingCustomer.resume}
            </Button>
          )}
          {canPause && (
            <Button onClick={() => onPause(sub)} size="sm" variant="outline">
              {content.billingCustomer.pause}
            </Button>
          )}
          {canCancel && (
            <Button
              className="hover:bg-destructive/10! text-destructive! border-destructive!"
              onClick={() => onCancel(sub)}
              size="sm"
              variant="outline"
            >
              {content.billingCustomer.cancel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
