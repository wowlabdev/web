import "server-only";

import type {
  AdjustmentCreatedEvent,
  AdjustmentUpdatedEvent,
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  EventEntity,
  SubscriptionCanceledEvent,
  SubscriptionCreatedEvent,
  SubscriptionPastDueEvent,
  SubscriptionPausedEvent,
  SubscriptionResumedEvent,
  SubscriptionUpdatedEvent,
  TransactionCompletedEvent,
} from "@paddle/paddle-node-sdk";
import type { SupabaseClient } from "@supabase/supabase-js";

import { EventName } from "@paddle/paddle-node-sdk";

import type { Database } from "@wowlab/shared/lib/supabase/database.types";

import { log } from "@/lib/observability";
import { PaddleCustomDataSchema, parse } from "@/lib/zod";
import { PRICE_TO_PLAN } from "@wowlab/shared/lib/billing/constants";
import { env } from "@wowlab/shared/lib/env";

type AdjustmentEvent = AdjustmentCreatedEvent | AdjustmentUpdatedEvent;

type CustomerEvent = CustomerCreatedEvent | CustomerUpdatedEvent;

type Sb = SupabaseClient<Database>;

type SubscriptionEvent =
  | SubscriptionCanceledEvent
  | SubscriptionCreatedEvent
  | SubscriptionPastDueEvent
  | SubscriptionPausedEvent
  | SubscriptionResumedEvent
  | SubscriptionUpdatedEvent;

export async function dispatchPaddleEvent(event: EventEntity, sb: Sb) {
  switch (event.eventType) {
    case EventName.AdjustmentCreated:
    case EventName.AdjustmentUpdated: {
      return handleAdjustment(event, sb);
    }

    case EventName.CustomerCreated:
    case EventName.CustomerUpdated: {
      return handleCustomer(event, sb);
    }

    case EventName.SubscriptionCanceled:
    case EventName.SubscriptionCreated:
    case EventName.SubscriptionPastDue:
    case EventName.SubscriptionPaused:
    case EventName.SubscriptionResumed:
    case EventName.SubscriptionUpdated: {
      return handleSubscription(event, sb);
    }

    case EventName.TransactionCompleted: {
      return handleTransactionCompleted(event, sb);
    }

    case EventName.TransactionPaymentFailed: {
      log
        .withMetadata({
          customerId: event.data.customerId,
          id: event.data.id,
        })
        .warn("paddle: payment failed");

      return;
    }
  }
}

async function handleAdjustment(event: AdjustmentEvent, sb: Sb) {
  if (event.data.status !== "approved") {
    return;
  }

  if (event.data.items.length === 0) {
    return;
  }

  await sb.rpc("paddle_refund_boosts", {
    p_event_id: event.eventId,
    p_occurred_at: event.occurredAt,
    p_quantity: Number.MAX_SAFE_INTEGER,
    p_transaction_id: event.data.transactionId,
  });
}

async function handleCustomer(event: CustomerEvent, sb: Sb) {
  await sb.rpc("paddle_apply_customer_event", {
    p_customer_id: event.data.id,
    p_email: event.data.email,
    p_event_id: event.eventId,
    p_event_type: event.eventType,
    p_occurred_at: event.occurredAt,
  });
}

async function handleSubscription(event: SubscriptionEvent, sb: Sb) {
  const item = event.data.items[0];
  const cd = parse(PaddleCustomDataSchema, event.data.customData, {});

  // prettier-ignore
  await sb.rpc("paddle_apply_subscription_event", {
    p_canceled_at: event.data.canceledAt,
    p_current_period_ends_at: event.data.currentBillingPeriod?.endsAt ?? null,
    p_current_period_starts_at: event.data.currentBillingPeriod?.startsAt ?? null,
    p_customer_id: event.data.customerId,
    p_event_id: event.eventId,
    p_event_type: event.eventType,
    p_next_billed_at: event.data.nextBilledAt,
    p_occurred_at: event.occurredAt,
    p_plan: PRICE_TO_PLAN[item.price?.id ?? ""] ?? "individual",
    p_quantity: item.quantity,
    p_scheduled_change_action: event.data.scheduledChange?.action ?? null,
    p_scheduled_change_effective_at: event.data.scheduledChange?.effectiveAt ?? null,
    p_scheduled_change_resume_at: event.data.scheduledChange?.resumeAt ?? null,
    p_status: event.data.status,
    p_subscription_id: event.data.id,
    p_supabase_user_id: cd.supabase_user_id ?? null,
  });
}

async function handleTransactionCompleted(
  event: TransactionCompletedEvent,
  sb: Sb,
) {
  if (event.data.subscriptionId) {
    return;
  }

  const line = event.data.details?.lineItems.find(
    (li) => li.priceId === env.PADDLE_PRICE_BOOST_PACK,
  );
  const cd = parse(PaddleCustomDataSchema, event.data.customData, {});

  if (!line || !cd.supabase_user_id) {
    return;
  }

  if (event.data.customerId) {
    await sb.rpc("paddle_link_customer_to_user", {
      p_customer_id: event.data.customerId,
      p_supabase_user_id: cd.supabase_user_id,
    });
  }

  await sb.rpc("paddle_credit_boosts", {
    p_event_id: event.eventId,
    p_occurred_at: event.occurredAt,
    p_quantity: line.quantity,
    p_supabase_user_id: cd.supabase_user_id,
    p_transaction_id: event.data.id,
  });
}
