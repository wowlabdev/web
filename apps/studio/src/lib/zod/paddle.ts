import { z } from "zod";

export const PaddleCustomDataSchema = z.object({
  plan: z.enum(["individual", "guild"]).optional(),
  supabase_user_id: z.string().optional(),
});

export type PaddleCustomData = z.infer<typeof PaddleCustomDataSchema>;

export const SubscriptionPlanSchema = z.enum(["free", "guild", "individual"]);

export const SubscriptionStatusSchema = z.enum([
  "active",
  "canceled",
  "free",
  "past_due",
  "paused",
  "trialing",
]);

export const PaddleTransactionStatusSchema = z.enum([
  "draft",
  "ready",
  "billed",
  "paid",
  "completed",
  "canceled",
  "past_due",
]);

export const PaddleSubscriptionStatusSchema = z.enum([
  "active",
  "canceled",
  "past_due",
  "paused",
  "trialing",
]);

export const AdminCreateAdjustmentSchema = z.object({
  action: z.enum(["refund", "credit", "chargeback"]),
  items: z
    .array(
      z.object({
        amount: z.string().optional(),
        itemId: z.string(),
        type: z.enum(["full", "partial", "tax", "proration"]),
      }),
    )
    .optional(),
  reason: z.string().min(1).max(500),
  transactionId: z.string(),
});

export const AdminUpdateSubscriptionSchema = z.object({
  priceId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const AdminCancelSubscriptionSchema = z.object({
  immediate: z.boolean().default(false),
});

export const AdminPauseSubscriptionSchema = z.object({
  immediate: z.boolean().default(false),
});

export const SubscriptionOwnershipSchema = z.object({
  subscriptionId: z.string().min(1),
});

export const CancelSubscriptionSchema = SubscriptionOwnershipSchema.extend({
  immediate: z.preprocess((value) => value === true, z.boolean()),
});

export const UpdateSubscriptionSchema = SubscriptionOwnershipSchema.extend({
  priceId: z.string().min(1),
  quantity: z.number().min(1),
});
