"use client";

import { ChevronLeftIcon, ChevronRightIcon, Trash2Icon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import type { useReservedHandles } from "@/lib/query/services";

import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import { FormattedDate } from "@wowlab/shared/components/common";
import {
  Skeleton,
  SkeletonTable,
} from "@wowlab/shared/components/common/skeleton-blocks";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Input } from "@wowlab/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wowlab/shared/components/ui/table";

import { PAGE_SIZE, RESERVED_HANDLE_SEARCH_KEYS } from "./utils";

type HandlesTableCardProps = {
  data: ReservedHandleRow[] | undefined;
  isFetching: boolean;
  isDeletePending: boolean;
  page: number;
  onDelete: (handle: string) => Promise<void>;
  onPageChange: (page: number) => void;
};

type ReservedHandleRow = NonNullable<
  ReturnType<typeof useReservedHandles>["data"]
>[number];

export function HandlesTableCard({
  data,
  isDeletePending,
  isFetching,
  onDelete,
  onPageChange,
  page,
}: Readonly<HandlesTableCardProps>) {
  const content = useIntlayer("admin");
  const [search, setSearch] = useState("");

  const rows = useFuzzySearch({
    items: data ?? [],
    keys: RESERVED_HANDLE_SEARCH_KEYS,
    query: search,
  });

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = rows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const renderBody = () => {
    if (isFetching && !data) {
      return <HandlesTableCardSkeleton />;
    }

    if (pageRows.length > 0) {
      return (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{content.handles.handle}</TableHead>
                <TableHead>{content.handles.reason}</TableHead>
                <TableHead>{content.handles.created}</TableHead>
                <TableHead>{content.handles.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((row) => (
                <TableRow key={row.handle}>
                  <TableCell className="font-medium">{row.handle}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.reason}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <FormattedDate value={row.created_at} dateStyle="medium" />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => void onDelete(row.handle)}
                      disabled={isDeletePending}
                    >
                      <Trash2Icon className="size-4" />
                      <span className="sr-only">{content.handles.actions}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <span className="text-muted-foreground min-w-16 text-center text-xs">
              {currentPage} /{pageCount}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentPage >= pageCount}
              onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <p className="text-muted-foreground text-sm">{content.handles.empty}</p>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>{content.handles.reservedHandles}</CardTitle>
        <Input
          className="max-w-xs"
          placeholder={content.handles.searchHandles.value}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            onPageChange(1);
          }}
        />
      </CardHeader>
      <CardContent>{renderBody()}</CardContent>
    </Card>
  );
}

function HandlesTableCardSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonTable cols={["w-28", "w-24", "w-24", "w-8"]} />
      <div className="flex items-center justify-center gap-2">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="size-8 rounded-md" />
      </div>
    </div>
  );
}
