"use client";

import { useBoolean, useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";
import { useState } from "react";

import type { Row } from "@wowlab/shared/lib/supabase/types";

import { MIN_GUILD_SLOTS } from "@wowlab/shared/lib/billing/constants";

import { BillingCancelDialog } from "./billing-cancel-dialog";
import { BillingChangeSlotsDialog } from "./billing-change-slots-dialog";
import { BillingPauseDialog } from "./billing-pause-dialog";
import { BillingSubscriptionCard } from "./billing-subscription-card";
import { useBillingActions } from "./use-billing-actions";

type BillingSubscriptionSectionProps = {
  isLoading: boolean;
  subscription: Row<"subscriptions"> | null | undefined;
};

export function BillingSubscriptionSection({
  isLoading,
  subscription,
}: Readonly<BillingSubscriptionSectionProps>) {
  const formatDate = useDate();
  const actions = useBillingActions(subscription);
  const content = useIntlayer("accountPage");

  const [showCancel, { set: setShowCancel, setTrue: openCancel }] =
    useBoolean(false);
  const [showPause, { set: setShowPause, setTrue: openPause }] =
    useBoolean(false);
  const [showSlots, { set: setShowSlots, setTrue: openSlots }] =
    useBoolean(false);
  const [newSlots, setNewSlots] = useState(MIN_GUILD_SLOTS);

  const periodEndLabel = subscription?.current_period_ends_at
    ? formatDate(new Date(subscription.current_period_ends_at), {
        dateStyle: "medium",
      })
    : content.billingSubscriptionCurrentPeriod.value;

  const handleConfirmCancel = useMemoizedFn(async () => {
    const ok = await actions.handleCancel();

    if (ok) {
      setShowCancel(false);
    }
  });

  const handleConfirmPause = useMemoizedFn(async () => {
    const ok = await actions.handlePause();

    if (ok) {
      setShowPause(false);
    }
  });

  const handleConfirmSlots = useMemoizedFn(async () => {
    const ok = await actions.handleUpdateSlots(newSlots);

    if (ok) {
      setShowSlots(false);
    }
  });

  const handleOpenChangeSlots = useMemoizedFn(() => {
    if (subscription) {
      setNewSlots(subscription.quantity);
    }

    openSlots();
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col space-y-1">
          <h3 className="font-semibold">{content.billingSubscriptionTitle}</h3>
          <p className="text-muted-foreground text-sm">
            {content.billingSubscriptionDescription}
          </p>
        </div>
        <div className="space-y-4 lg:col-span-2">
          <BillingSubscriptionCard
            isLoading={isLoading}
            onCancel={openCancel}
            onChangeSlots={handleOpenChangeSlots}
            onPause={openPause}
            onResume={actions.handleResume}
            onUpdatePaymentMethod={actions.handleUpdatePaymentMethod}
            isPaymentMethodPending={actions.paymentMethod.isPending}
            isResumePending={actions.resume.isPending}
            subscription={subscription}
          />
        </div>
      </div>

      <BillingCancelDialog
        error={actions.cancel.error}
        isDisabled={!subscription}
        isOpen={showCancel}
        isPending={actions.cancel.isPending}
        onConfirm={handleConfirmCancel}
        onOpenChange={setShowCancel}
        periodEndLabel={periodEndLabel}
      />

      <BillingPauseDialog
        error={actions.pause.error}
        isDisabled={!subscription}
        isOpen={showPause}
        isPending={actions.pause.isPending}
        onConfirm={handleConfirmPause}
        onOpenChange={setShowPause}
      />

      <BillingChangeSlotsDialog
        currentSlots={subscription?.quantity}
        error={actions.update.error}
        isOpen={showSlots}
        isPending={actions.update.isPending}
        onConfirm={handleConfirmSlots}
        onOpenChange={setShowSlots}
        onSlotsChange={setNewSlots}
        slots={newSlots}
      />
    </>
  );
}
