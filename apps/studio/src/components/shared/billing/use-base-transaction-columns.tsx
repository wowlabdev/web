"use client";

import { useCurrency, useDate } from "next-intlayer/format";
import { useMemo } from "react";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { TXN_STATUS_VARIANTS } from "@wowlab/shared/lib/billing/constants";

import type { Column } from "./types";

export type BaseTransactionLabels = {
  amount: string;
  date: string;
  description: string;
  emptyValue: string;
  status: string;
};

export type BaseTransactionRow = {
  billedAt: string | null;
  currencyCode: string;
  description: string;
  status: string;
  totalMinor: string;
};

export function useBaseTransactionColumns<T extends BaseTransactionRow>(
  labels: BaseTransactionLabels,
): Column<T>[] {
  const formatDate = useDate();
  const formatCurrency = useCurrency();

  return useMemo(
    () => [
      {
        cell: (row: T) =>
          row.billedAt
            ? formatDate(new Date(row.billedAt), { dateStyle: "medium" })
            : labels.emptyValue,
        header: labels.date,
      },
      {
        cell: (row: T) => row.description || labels.emptyValue,
        header: labels.description,
      },
      {
        cell: (row: T) => (
          <Badge variant={TXN_STATUS_VARIANTS[row.status] ?? "secondary"}>
            {row.status}
          </Badge>
        ),
        header: labels.status,
      },
      {
        cell: (row: T) => (
          <span className="tabular-nums">
            {formatCurrency(Number(row.totalMinor) / 100, {
              currency: row.currencyCode,
            })}
          </span>
        ),
        className: "text-right",
        header: labels.amount,
      },
    ],
    [formatDate, formatCurrency, labels],
  );
}
