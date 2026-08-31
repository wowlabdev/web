"use client";

import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";
import { useMemo } from "react";

import type { Column } from "@/components/shared/billing";
import type { Row } from "@wowlab/shared/lib/supabase/types";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { cn } from "@wowlab/shared/lib/utils";

export function useLedgerColumns(): Column<Row<"boost_ledger">>[] {
  const content = useIntlayer("admin");
  const formatDate = useDate();

  return useMemo<Column<Row<"boost_ledger">>[]>(
    () => [
      {
        cell: (row) =>
          formatDate(new Date(row.created_at), { dateStyle: "medium" }),
        header: content.billingCustomer.ledgerColumnDate.value,
      },
      {
        cell: (row) => (
          <Badge
            variant={row.reason === "refund" ? "destructive" : "secondary"}
          >
            {row.reason}
          </Badge>
        ),
        header: content.billingCustomer.ledgerColumnReason.value,
      },
      {
        cell: (row) => (
          <span
            className={cn("tabular-nums", row.delta < 0 && "text-destructive")}
          >
            {row.delta > 0 ? "+" : ""}
            {row.delta}
          </span>
        ),
        className: "text-right pr-6",
        header: content.billingCustomer.ledgerColumnBoosts.value,
      },
    ],
    [content, formatDate],
  );
}
