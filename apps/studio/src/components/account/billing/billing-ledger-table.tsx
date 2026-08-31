"use client";

import { useIntlayer } from "next-intlayer";

import type { Row } from "@wowlab/shared/lib/supabase/types";

import {
  SkeletonCard,
  SkeletonTable,
} from "@wowlab/shared/components/common/skeleton-blocks";
import { TableCard } from "@wowlab/shared/components/common/table-card";

import { useBillingLedgerColumns } from "./use-billing-ledger-columns";

type BillingLedgerTableProps = {
  ledger: Row<"boost_ledger">[] | undefined;
  isLoading: boolean;
};

export function BillingLedgerTable({
  isLoading,
  ledger,
}: Readonly<BillingLedgerTableProps>) {
  const columns = useBillingLedgerColumns();
  const content = useIntlayer("accountPage");

  if (isLoading) {
    return <BillingLedgerTableSkeleton />;
  }

  const rows = ledger ?? [];

  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {content.billingLedgerEmpty}
      </p>
    );
  }

  return (
    <TableCard
      columns={columns}
      data={rows}
      rowKey={(row) => row.id}
      title={content.billingLedgerTitle.value}
    />
  );
}

function BillingLedgerTableSkeleton() {
  return (
    <SkeletonCard headerWidth="w-32">
      <SkeletonTable cols={["w-24", "w-16", "w-10"]} />
    </SkeletonCard>
  );
}
