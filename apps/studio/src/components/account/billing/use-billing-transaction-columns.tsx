"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import type { BillingTransaction } from "@/lib/paddle/transactions";

import {
  type Column,
  useBaseTransactionColumns,
} from "@/components/shared/billing";
import { Button } from "@wowlab/shared/components/ui/button";

export function useBillingTransactionColumns(): Column<BillingTransaction>[] {
  const content = useIntlayer("accountPage");
  const baseColumns = useBaseTransactionColumns<BillingTransaction>({
    amount: content.billingTransactionColumnAmount.value,
    date: content.billingTransactionColumnDate.value,
    description: content.billingTransactionColumnDescription.value,
    emptyValue: "-",
    status: content.billingTransactionColumnStatus.value,
  });

  return useMemo(
    () => [
      ...baseColumns,
      {
        cell: (row: BillingTransaction) =>
          row.status === "completed" || row.status === "paid" ? (
            <Button asChild size="sm" variant="outline">
              <a href={`/api/paddle/invoice/${row.id}`} rel="noopener">
                {content.billingInvoice}
              </a>
            </Button>
          ) : null,
        className: "text-right pr-6",
        header: "",
      },
    ],
    [baseColumns, content],
  );
}
