"use client";

import { useForm } from "@tanstack/react-form";
import { useIntlayer } from "next-intlayer";
import { z } from "zod";

import type { AdminTransaction } from "@/lib/paddle/transactions";

import { useCreateAdjustment } from "@/lib/query/services";

import type { RefundFormValues } from "./refund-dialog-types";

import { displayToMinor } from "./refund-dialog-utils";

export type RefundForm = ReturnType<typeof useRefundForm>["form"];

type UseRefundFormArgs = {
  onOpenChange: (open: boolean) => void;
  transaction: AdminTransaction;
};

export function useRefundForm({
  onOpenChange,
  transaction,
}: UseRefundFormArgs) {
  const content = useIntlayer("admin");
  const create = useCreateAdjustment();

  const schema = z.object({
    action: z.enum(["credit", "refund"]),
    lineItems: z.array(
      z.object({
        amount: z.string(),
        isSelected: z.boolean(),
        type: z.enum(["full", "partial"]),
      }),
    ),
    reason: z
      .string()
      .trim()
      .min(1, content.billingRefundDialog.reasonRequired.value)
      .max(500, content.billingRefundDialog.reasonTooLong.value),
  }) satisfies z.ZodType<RefundFormValues>;

  const defaultValues: RefundFormValues = {
    action: "refund",
    lineItems: transaction.lineItems.map(() => ({
      amount: "",
      isSelected: false,
      type: "full",
    })),
    reason: "",
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const selectedEntries = transaction.lineItems
        .map((lineItem, index) => ({ item: value.lineItems[index]!, lineItem }))
        .filter((entry) => entry.item.isSelected);

      const allFull = selectedEntries.every(
        (entry) => entry.item.type === "full",
      );

      if (allFull) {
        try {
          await create.mutateAsync({
            action: value.action,
            reason: value.reason,
            transactionId: transaction.id,
          });
          onOpenChange(false);
        } catch {
          // surfaced via create.error
        }

        return;
      }

      const itemsPayload: {
        amount?: string;
        itemId: string;
        type: "full" | "partial";
      }[] = selectedEntries.map((entry) =>
        entry.item.type === "full"
          ? { itemId: entry.lineItem.id, type: "full" }
          : {
              amount: displayToMinor(entry.item.amount)!,
              itemId: entry.lineItem.id,
              type: "partial",
            },
      );

      try {
        await create.mutateAsync({
          action: value.action,
          items: itemsPayload,
          reason: value.reason,
          transactionId: transaction.id,
        });
        onOpenChange(false);
      } catch {
        // surfaced via create.error
      }
    },
    validators: {
      onChange: schema.superRefine((value, ctx) => {
        for (const [index, item] of value.lineItems.entries()) {
          if (
            item.isSelected &&
            item.type === "partial" &&
            displayToMinor(item.amount) === null
          ) {
            ctx.addIssue({
              code: "custom",
              message: content.billingRefundDialog.invalidAmount({
                description: transaction.lineItems[index]!.description,
              }).value,
              path: ["lineItems", index, "amount"],
            });
          }
        }
      }),
    },
  });

  return { create, form };
}
