"use client";

import { useIntlayer } from "next-intlayer";

import type { AdminTransaction } from "@/lib/paddle/transactions";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@wowlab/shared/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@wowlab/shared/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";
import { Textarea } from "@wowlab/shared/components/ui/textarea";

import type { RefundAction } from "./refund-dialog-types";

import { RefundLineItemRow } from "./refund-line-item-row";
import { useRefundForm } from "./use-refund-form";

type RefundDialogInnerProps = {
  onOpenChange: (open: boolean) => void;
  transaction: AdminTransaction;
};

export function RefundDialogInner({
  onOpenChange,
  transaction,
}: Readonly<RefundDialogInnerProps>) {
  const content = useIntlayer("admin");
  const { create, form } = useRefundForm({ onOpenChange, transaction });

  const resolveSubmitLabel = () => {
    if (create.isPending) {
      return content.billingRefundDialog.submitting;
    }

    if (form.state.values.action === "refund") {
      return content.billingRefundDialog.issueRefund;
    }

    return content.billingRefundDialog.issueCredit;
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <DialogHeader className="space-y-2">
        <DialogTitle>{content.billingRefundDialog.title}</DialogTitle>
        <p className="text-muted-foreground text-sm">
          {transaction.invoiceNumber
            ? content.billingRefundDialog.invoicePrefix({
                number: transaction.invoiceNumber,
              })
            : content.billingRefundDialog.transactionPrefix({
                id: transaction.id,
              })}
        </p>
      </DialogHeader>

      <div className="space-y-4">
        <form.Field name="action">
          {(field) => (
            <Field>
              <FieldLabel>{content.billingRefundDialog.action}</FieldLabel>
              <Select
                onValueChange={(value) =>
                  field.handleChange(value as RefundAction)
                }
                value={field.state.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refund">
                    {content.billingRefundDialog.refund}
                  </SelectItem>
                  <SelectItem value="credit">
                    {content.billingRefundDialog.credit}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        </form.Field>

        <Field>
          <FieldLabel>{content.billingRefundDialog.lineItemsLabel}</FieldLabel>
          <form.Field mode="array" name="lineItems">
            {(arrayField) => (
              <div className="space-y-2">
                {arrayField.state.value.map((_, index) => (
                  <RefundLineItemRow
                    currencyCode={transaction.currencyCode}
                    form={form}
                    index={index}
                    key={transaction.lineItems[index]!.id}
                    lineItem={transaction.lineItems[index]!}
                  />
                ))}
              </div>
            )}
          </form.Field>
        </Field>

        <form.Field name="reason">
          {(field) => (
            <Field
              data-invalid={field.state.meta.errors.length > 0 || undefined}
            >
              <FieldLabel htmlFor="refund-reason">
                {content.billingRefundDialog.reason}
              </FieldLabel>
              <Textarea
                id="refund-reason"
                maxLength={500}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder={
                  content.billingRefundDialog.reasonPlaceholder.value
                }
                rows={3}
                value={field.state.value}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        </form.Field>

        {create.error && (
          <Alert variant="destructive">
            <AlertTitle>{content.billingRefundDialog.errorTitle}</AlertTitle>
            <AlertDescription>{create.error.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <DialogFooter className="mt-4 gap-2 sm:justify-end">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            {content.billingRefundDialog.cancel}
          </Button>
        </DialogClose>
        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <Button disabled={!canSubmit || create.isPending} type="submit">
              {resolveSubmitLabel()}
            </Button>
          )}
        </form.Subscribe>
      </DialogFooter>
    </form>
  );
}
