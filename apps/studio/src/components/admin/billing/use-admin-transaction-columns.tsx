"use client";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import type { AdminTransaction } from "@/lib/paddle/transactions";

import {
  type Column,
  useBaseTransactionColumns,
} from "@/components/shared/billing";
import { Button } from "@wowlab/shared/components/ui/button";
import { href, routes } from "@wowlab/shared/lib/routing";

type Options = {
  onRefund?: (row: AdminTransaction) => void;
  shouldShowCustomer?: boolean;
};

export function useAdminTransactionColumns({
  onRefund,
  shouldShowCustomer = true,
}: Options = {}): Column<AdminTransaction>[] {
  const content = useIntlayer("admin");
  const baseColumns = useBaseTransactionColumns<AdminTransaction>({
    amount: content.billingTransactionColumns.amount.value,
    date: content.billingTransactionColumns.date.value,
    description: content.billingTransactionColumns.description.value,
    emptyValue: "—",
    status: content.billingTransactionColumns.status.value,
  });

  return useMemo(() => {
    const cols: Column<AdminTransaction>[] = [];

    if (shouldShowCustomer) {
      cols.push({
        cell: (row) =>
          row.customerId ? (
            <a
              className="hover:underline"
              href={href(routes.admin.billing.customer, { id: row.customerId })}
              onClick={(event) => event.stopPropagation()}
            >
              {row.customerEmail ?? row.customerId}
            </a>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
        header: content.billingTransactionColumns.customer.value,
      });
    }

    cols.push(...baseColumns);

    if (onRefund) {
      cols.push({
        cell: (row) =>
          row.status === "completed" || row.status === "paid" ? (
            <Button
              onClick={(event) => {
                event.stopPropagation();
                onRefund(row);
              }}
              size="sm"
              variant="outline"
            >
              {content.billingTransactionColumns.refund}
            </Button>
          ) : null,
        className: "text-right pr-6",
        header: "",
      });
    }

    return cols;
  }, [baseColumns, content, onRefund, shouldShowCustomer]);
}
