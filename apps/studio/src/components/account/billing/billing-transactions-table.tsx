"use client";

import { useBoolean } from "ahooks";
import { CheckCircle2Icon, SearchIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import type { BillingTransaction } from "@/lib/paddle/transactions";

import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import {
  SkeletonCard,
  SkeletonTable,
} from "@wowlab/shared/components/common/skeleton-blocks";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
} from "@wowlab/shared/components/ui/empty";
import { Input } from "@wowlab/shared/components/ui/input";
import { Toggle } from "@wowlab/shared/components/ui/toggle";

import { useBillingTransactionColumns } from "./use-billing-transaction-columns";

type BillingTransactionsTableProps = {
  isLoading: boolean;
  transactions: BillingTransaction[] | undefined;
};

const SEARCH_KEYS = [
  "currencyCode",
  "description",
  "id",
  "invoiceNumber",
  "status",
] as const satisfies readonly (keyof BillingTransaction)[];

const SUCCESS_STATUSES = new Set(["completed", "paid"]);

export function BillingTransactionsTable({
  isLoading,
  transactions,
}: Readonly<BillingTransactionsTableProps>) {
  const columns = useBillingTransactionColumns();
  const content = useIntlayer("accountPage");
  const [search, setSearch] = useState("");
  const [isSuccessOnly, { toggle: toggleSuccessOnly }] = useBoolean(true);

  const all = transactions ?? [];
  const filtered = isSuccessOnly
    ? all.filter((t) => SUCCESS_STATUSES.has(t.status))
    : all;
  const rows = useFuzzySearch({
    items: filtered,
    keys: SEARCH_KEYS,
    query: search,
  });

  if (isLoading) {
    return <BillingTransactionsTableSkeleton />;
  }

  if (all.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyDescription>{content.billingHistoryEmpty}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <TableCard
      columns={columns}
      data={rows}
      headerActions={
        <>
          <Toggle
            className="h-8 whitespace-nowrap"
            onPressedChange={toggleSuccessOnly}
            pressed={isSuccessOnly}
            size="sm"
            variant="outline"
          >
            <CheckCircle2Icon className="size-3.5" />
            {content.billingHistoryOnlyPaid}
          </Toggle>
          <div className="relative">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <Input
              className="h-8 w-56 pl-8 text-xs"
              onChange={(event) => setSearch(event.target.value)}
              placeholder={content.billingHistorySearchPlaceholder.value}
              value={search}
            />
          </div>
        </>
      }
      rowKey={(row) => row.id}
      title={content.billingHistoryTitle.value}
    />
  );
}

function BillingTransactionsTableSkeleton() {
  return (
    <SkeletonCard headerWidth="w-32">
      <SkeletonTable cols={["w-24", "w-40", "w-16", "w-16", "w-16"]} />
    </SkeletonCard>
  );
}
