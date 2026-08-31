"use client";

import { useMemoizedFn } from "ahooks";

import type { Row } from "@wowlab/shared/lib/supabase/types";

import {
  useCancelSubscription,
  usePauseSubscription,
  usePaymentMethodTransaction,
  useResumeSubscription,
  useUpdateSubscription,
} from "@/lib/query/services";
import { env } from "@wowlab/shared/lib/env";
import { openPaymentMethodCheckout } from "@wowlab/shared/lib/paddle/client";

type Subscription = Row<"subscriptions"> | null | undefined;

export function useBillingActions(subscription: Subscription) {
  const cancel = useCancelSubscription();
  const pause = usePauseSubscription();
  const resume = useResumeSubscription();
  const update = useUpdateSubscription();
  const paymentMethod = usePaymentMethodTransaction();

  const run = useMemoizedFn(async (fn: () => Promise<unknown>) => {
    try {
      await fn();

      return true;
    } catch {
      // error surfaced via mutation.error
      return false;
    }
  });

  const handleCancel = useMemoizedFn(() =>
    run(() =>
      cancel.mutateAsync({
        subscriptionId: subscription!.paddle_subscription_id,
      }),
    ),
  );

  const handlePause = useMemoizedFn(() =>
    run(() =>
      pause.mutateAsync({
        subscriptionId: subscription!.paddle_subscription_id,
      }),
    ),
  );

  const handleResume = useMemoizedFn(() =>
    run(() =>
      resume.mutateAsync({
        subscriptionId: subscription!.paddle_subscription_id,
      }),
    ),
  );

  const handleUpdateSlots = useMemoizedFn((quantity: number) =>
    run(() =>
      update.mutateAsync({
        priceId: env.PADDLE_PRICE_GUILD_SLOT,
        quantity,
        subscriptionId: subscription!.paddle_subscription_id,
      }),
    ),
  );

  const handleUpdatePaymentMethod = useMemoizedFn(() =>
    run(async () => {
      if (!subscription) {
        return;
      }

      const transactionId = await paymentMethod.mutateAsync({
        subscriptionId: subscription.paddle_subscription_id,
      });

      await openPaymentMethodCheckout(transactionId);
    }),
  );

  return {
    cancel,
    handleCancel,
    handlePause,
    handleResume,
    handleUpdatePaymentMethod,
    handleUpdateSlots,
    pause,
    paymentMethod,
    resume,
    update,
  };
}
