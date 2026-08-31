"use client";

import { useIntlayer } from "next-intlayer";
import { useCurrency } from "next-intlayer/format";

import type { AdminTransactionLineItem } from "@/lib/paddle/transactions";

import { Checkbox } from "@wowlab/shared/components/ui/checkbox";
import { Field, FieldError } from "@wowlab/shared/components/ui/field";
import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import type { RefundType } from "./refund-dialog-types";
import type { RefundForm } from "./use-refund-form";

type RefundLineItemRowProps = {
  currencyCode: string;
  form: RefundForm;
  index: number;
  lineItem: AdminTransactionLineItem;
};

export function RefundLineItemRow({
  currencyCode,
  form,
  index,
  lineItem,
}: Readonly<RefundLineItemRowProps>) {
  const content = useIntlayer("admin");
  const formatCurrency = useCurrency();

  return (
    <div className="rounded-md border px-3 py-2 text-sm">
      <form.Field name={`lineItems[${index}].isSelected`}>
        {(field) => (
          <div className="flex items-center gap-3">
            <Checkbox
              checked={field.state.value}
              id={`refund-item-${lineItem.id}`}
              onCheckedChange={(checked) =>
                field.handleChange(checked === true)
              }
            />
            <Label
              className="flex-1 cursor-pointer"
              htmlFor={`refund-item-${lineItem.id}`}
            >
              {lineItem.description || lineItem.priceId}
            </Label>
            <span className="text-muted-foreground tabular-nums">
              {formatCurrency(Number(lineItem.totalMinor) / 100, {
                currency: currencyCode,
              })}
            </span>
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => {
          const item = state.values.lineItems[index]!;

          return { isSelected: item.isSelected, type: item.type };
        }}
      >
        {({ isSelected, type }) =>
          isSelected ? (
            <div className="mt-2 flex items-start gap-2">
              <form.Field name={`lineItems[${index}].type`}>
                {(field) => (
                  <Select
                    onValueChange={(value) =>
                      field.handleChange(value as RefundType)
                    }
                    value={field.state.value}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">
                        {content.billingRefundDialog.full}
                      </SelectItem>
                      <SelectItem value="partial">
                        {content.billingRefundDialog.partial}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </form.Field>
              {type === "partial" ? (
                <form.Field name={`lineItems[${index}].amount`}>
                  {(field) => (
                    <Field
                      data-invalid={
                        field.state.meta.errors.length > 0 || undefined
                      }
                    >
                      <Input
                        className="w-32"
                        inputMode="decimal"
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder={
                          content.billingRefundDialog.partialPlaceholder.value
                        }
                        value={field.state.value}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              ) : null}
            </div>
          ) : null
        }
      </form.Subscribe>
    </div>
  );
}
