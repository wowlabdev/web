"use client";

import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";
import { useMemo } from "react";

import type { Column } from "@/components/shared/billing";
import type { Row } from "@wowlab/shared/lib/supabase/types";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { cn } from "@wowlab/shared/lib/utils";

export function useBillingLedgerColumns(): Column<Row<"boost_ledger">>[] {
  const formatDate = useDate();
  const content = useIntlayer("accountPage");

  return useMemo(
    () => [
      {
        cell: (row: Row<"boost_ledger">) =>
          formatDate(new Date(row.created_at), { dateStyle: "medium" }),
        header: content.billingLedgerColumnDate.value,
      },
      {
        cell: (row: Row<"boost_ledger">) => (
          <Badge
            variant={row.reason === "refund" ? "destructive" : "secondary"}
          >
            {row.reason}
          </Badge>
        ),
        header: content.billingLedgerColumnType.value,
      },
      {
        cell: (row: Row<"boost_ledger">) => (
          <span
            className={cn("tabular-nums", row.delta < 0 && "text-destructive")}
          >
            {row.delta > 0 ? "+" : ""}
            {row.delta}
          </span>
        ),
        className: "text-right pr-6",
        header: content.billingLedgerColumnBoosts.value,
      },
    ],
    [formatDate, content],
  );
}
