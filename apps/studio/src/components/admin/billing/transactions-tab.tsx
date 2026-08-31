"use client";

import { useBoolean, useMemoizedFn } from "ahooks";
import { SearchIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { AdminTransaction } from "@/lib/paddle/transactions";

import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import { useAdminTransactions } from "@/lib/query/services";
import {
  SkeletonCard,
  SkeletonTable,
} from "@wowlab/shared/components/common/skeleton-blocks";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Input } from "@wowlab/shared/components/ui/input";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@wowlab/shared/components/ui/toggle-group";
import { TXN_STATUS_OPTIONS } from "@wowlab/shared/lib/billing/constants";
import { href, routes } from "@wowlab/shared/lib/routing";

import { RefundDialog } from "./refund-dialog";
import { useAdminTransactionColumns } from "./use-admin-transaction-columns";

const SEARCH_KEYS = [
  "customerEmail",
  "description",
  "id",
  "invoiceNumber",
] as const satisfies readonly (keyof AdminTransaction & string)[];

export function TransactionsTab() {
  const content = useIntlayer("admin");
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const [refundOpen, { set: setRefundOpen, setTrue: openRefund }] =
    useBoolean(false);
  const [refundTarget, setRefundTarget] = useState<AdminTransaction | null>(
    null,
  );

  const { data, isLoading } = useAdminTransactions({
    status: statusFilter.length > 0 ? statusFilter : undefined,
  });

  const handleRefund = useMemoizedFn((row: AdminTransaction) => {
    setRefundTarget(row);
    openRefund();
  });

  const columns = useAdminTransactionColumns({
    onRefund: handleRefund,
    shouldShowCustomer: true,
  });

  const filtered = useFuzzySearch({
    items: data ?? [],
    keys: SEARCH_KEYS,
    query: search,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          className="flex flex-wrap gap-2"
          onValueChange={setStatusFilter}
          type="multiple"
          value={statusFilter}
          variant="outline"
        >
          {TXN_STATUS_OPTIONS.map((status) => (
            <ToggleGroupItem className="h-8" key={status} value={status}>
              {status}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="relative ml-auto">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input
            className="h-8 w-64 pl-8 text-xs"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={content.billingTransactionsTab.searchPlaceholder.value}
            value={search}
          />
        </div>
      </div>

      {isLoading ? (
        <TransactionsTabSkeleton />
      ) : (
        <TableCard
          columns={columns}
          data={filtered}
          onRowClick={(row) =>
            row.customerId
              ? router.push(
                  href(routes.admin.billing.customer, { id: row.customerId }),
                )
              : undefined
          }
          rowKey={(row) => row.id}
          title={content.billingTransactionsTab.transactions.value}
        />
      )}

      <RefundDialog
        isOpen={refundOpen}
        onOpenChange={setRefundOpen}
        transaction={refundTarget}
      />
    </div>
  );
}

function TransactionsTabSkeleton() {
  return (
    <SkeletonCard headerWidth="w-40" className="justify-between gap-2.5">
      <SkeletonTable
        cols={["w-40", "w-24", "w-32", "w-16", "w-20", "w-16"] as const}
      />
    </SkeletonCard>
  );
}
