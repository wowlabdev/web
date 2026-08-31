"use client";

import { useIntlayer } from "next-intlayer";
import { useCurrency, useDate } from "next-intlayer/format";
import { useMemo } from "react";

import type { AdminAdjustment } from "@/app/api/paddle/admin/adjustments/route";
import type { Column } from "@/components/shared/billing";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { ADJUSTMENT_STATUS_VARIANTS } from "@wowlab/shared/lib/billing/constants";

export function useAdjustmentColumns(): Column<AdminAdjustment>[] {
  const content = useIntlayer("admin");
  const formatDate = useDate();
  const formatCurrency = useCurrency();

  return useMemo<Column<AdminAdjustment>[]>(
    () => [
      {
        cell: (row) =>
          formatDate(new Date(row.createdAt), { dateStyle: "medium" }),
        header: content.billingCustomer.adjustmentColumnDate.value,
      },
      {
        cell: (row) => <Badge variant="outline">{row.action}</Badge>,
        header: content.billingCustomer.adjustmentColumnAction.value,
      },
      {
        cell: (row) => (
          <Badge
            variant={ADJUSTMENT_STATUS_VARIANTS[row.status] ?? "secondary"}
          >
            {row.status}
          </Badge>
        ),
        header: content.billingCustomer.adjustmentColumnStatus.value,
      },
      {
        cell: (row) => row.reason ?? "—",
        header: content.billingCustomer.adjustmentColumnReason.value,
      },
      {
        cell: (row) => (
          <span className="tabular-nums">
            {formatCurrency(Number(row.totalMinor) / 100, {
              currency: row.currencyCode,
            })}
          </span>
        ),
        className: "text-right pr-6",
        header: content.billingCustomer.adjustmentColumnAmount.value,
      },
    ],
    [content, formatCurrency, formatDate],
  );
}
