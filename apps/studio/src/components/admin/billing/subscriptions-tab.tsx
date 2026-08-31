"use client";

import { SearchIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type { AdminSubscription } from "@/app/api/paddle/admin/subscriptions/route";
import type { Column } from "@/components/shared/billing";

import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import { useAdminSubscriptions } from "@/lib/query/services";
import {
  SkeletonCard,
  SkeletonTable,
} from "@wowlab/shared/components/common/skeleton-blocks";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Input } from "@wowlab/shared/components/ui/input";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@wowlab/shared/components/ui/toggle-group";
import {
  PRICE_LABELS,
  STATUS_VARIANTS,
  SUBSCRIPTION_STATUS_OPTIONS,
} from "@wowlab/shared/lib/billing/constants";
import { href, routes } from "@wowlab/shared/lib/routing";

const SEARCH_KEYS = [
  "customerEmail",
  "customerId",
  "id",
] as const satisfies readonly (keyof AdminSubscription & string)[];

export function SubscriptionsTab() {
  const content = useIntlayer("admin");
  const router = useRouter();
  const formatDate = useDate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const { data, isLoading } = useAdminSubscriptions({
    status: statusFilter.length > 0 ? statusFilter : undefined,
  });

  const filtered = useFuzzySearch({
    items: data ?? [],
    keys: SEARCH_KEYS,
    query: search,
  });

  const columns = useMemo<Column<AdminSubscription>[]>(
    () => [
      {
        cell: (row) => row.customerEmail ?? row.customerId,
        header: content.billingSubscriptionsTab.customer.value,
      },
      {
        cell: (row) => PRICE_LABELS[row.plan] ?? row.plan,
        header: content.billingSubscriptionsTab.plan.value,
      },
      {
        cell: (row) => (
          <Badge variant={STATUS_VARIANTS[row.status] ?? "secondary"}>
            {row.status}
          </Badge>
        ),
        header: content.billingSubscriptionsTab.status.value,
      },
      {
        cell: (row) => <span className="tabular-nums">{row.quantity}</span>,
        className: "text-right",
        header: content.billingSubscriptionsTab.qty.value,
      },
      {
        cell: (row) =>
          row.nextBilledAt
            ? formatDate(new Date(row.nextBilledAt), { dateStyle: "medium" })
            : "—",
        className: "text-right pr-6",
        header: content.billingSubscriptionsTab.nextBilled.value,
      },
    ],
    [content, formatDate],
  );

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
          {SUBSCRIPTION_STATUS_OPTIONS.map((status) => (
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
            placeholder={
              content.billingSubscriptionsTab.searchPlaceholder.value
            }
            value={search}
          />
        </div>
      </div>

      {isLoading ? (
        <SubscriptionsTabSkeleton />
      ) : (
        <TableCard
          columns={columns}
          data={filtered}
          onRowClick={(row) =>
            router.push(
              href(routes.admin.billing.customer, { id: row.customerId }),
            )
          }
          rowKey={(row) => row.id}
          title={content.billingSubscriptionsTab.subscriptions.value}
        />
      )}
    </div>
  );
}

function SubscriptionsTabSkeleton() {
  return (
    <SkeletonCard headerWidth="w-40" className="justify-between gap-2.5">
      <SkeletonTable cols={["w-40", "w-24", "w-16", "w-10", "w-24"] as const} />
    </SkeletonCard>
  );
}
