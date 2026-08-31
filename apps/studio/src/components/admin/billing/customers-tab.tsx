"use client";

import { SearchIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type { AdminCustomer } from "@/app/api/paddle/admin/customers/route";
import type { Column } from "@/components/shared/billing";

import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import { useAdminCustomers } from "@/lib/query/services";
import {
  SkeletonCard,
  SkeletonTable,
} from "@wowlab/shared/components/common/skeleton-blocks";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Input } from "@wowlab/shared/components/ui/input";
import { href, routes } from "@wowlab/shared/lib/routing";

const SEARCH_KEYS = [
  "email",
  "id",
  "name",
] as const satisfies readonly (keyof AdminCustomer & string)[];

export function CustomersTab() {
  const content = useIntlayer("admin");
  const router = useRouter();
  const formatDate = useDate();

  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminCustomers();

  const filtered = useFuzzySearch({
    items: data ?? [],
    keys: SEARCH_KEYS,
    query: search,
  });

  const columns = useMemo<Column<AdminCustomer>[]>(
    () => [
      {
        cell: (row) =>
          row.email ?? <span className="text-muted-foreground">—</span>,
        header: content.billingCustomersTab.email.value,
      },
      {
        cell: (row) =>
          row.name ?? <span className="text-muted-foreground">—</span>,
        header: content.billingCustomersTab.name.value,
      },
      {
        cell: (row) => (
          <Badge variant={row.status === "active" ? "default" : "outline"}>
            {row.status}
          </Badge>
        ),
        header: content.billingCustomersTab.status.value,
      },
      {
        cell: (row) =>
          row.supabaseUserId ? (
            <Badge variant="secondary">
              {content.billingCustomersTab.linkedBadge}
            </Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
        header: content.billingCustomersTab.linked.value,
      },
      {
        cell: (row) =>
          formatDate(new Date(row.createdAt), { dateStyle: "medium" }),
        className: "text-right pr-6",
        header: content.billingCustomersTab.created.value,
      },
    ],
    [content, formatDate],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input
            className="h-8 w-72 pl-8 text-xs"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={content.billingCustomersTab.searchPlaceholder.value}
            value={search}
          />
        </div>
      </div>

      {isLoading ? (
        <CustomersTabSkeleton />
      ) : (
        <TableCard
          columns={columns}
          data={filtered}
          onRowClick={(row) =>
            router.push(href(routes.admin.billing.customer, { id: row.id }))
          }
          rowKey={(row) => row.id}
          title={content.billingCustomersTab.customers.value}
        />
      )}
    </div>
  );
}

function CustomersTabSkeleton() {
  return (
    <SkeletonCard headerWidth="w-40" className="justify-between gap-2.5">
      <SkeletonTable cols={["w-40", "w-32", "w-16", "w-16", "w-24"] as const} />
    </SkeletonCard>
  );
}
