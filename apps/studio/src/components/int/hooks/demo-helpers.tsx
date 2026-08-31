"use client";

import { useDebounce } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { useMemo, useState } from "react";

import type { QueryListResult } from "@/lib/data/result";

import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Input } from "@wowlab/shared/components/ui/input";

import { ResultPanel } from "./result-panel";
import { resultState } from "./result-state";
import { type Column } from "./use-entity-columns";

export const MAX_PREVIEW = 6;

export function IdsListDemo<T extends { id: number }>({
  columns,
  defaultIds,
  title,
  useResult,
}: Readonly<{
  columns: Column<T>[];
  defaultIds: number[];
  title: string;
  useResult: (ids: number[]) => QueryListResult<T>;
}>) {
  const content = useIntlayer("hooksPage");
  const [raw, setRaw] = useState(defaultIds.join(", "));
  const ids = useMemo(() => parseIds(raw), [raw]);
  const result = useResult(ids);
  const state = resultState(result);
  const rows = result.data ?? [];

  return (
    <div className="space-y-3">
      <Input
        value={raw}
        onChange={(event) => setRaw(event.target.value)}
        placeholder={content.idsLabel.value}
      />
      {state === "ok" ? (
        <TableCard
          columns={columns}
          data={rows.slice(0, MAX_PREVIEW)}
          rowKey={(row) => row.id}
          title={`${title} (${rows.length})`}
        />
      ) : (
        <ResultPanel state={state} />
      )}
    </div>
  );
}

export function parseIds(raw: string): number[] {
  return raw
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isFinite(value) && value > 0);
}

export function SearchTableDemo<T extends { id: number }>({
  columns,
  defaultQuery,
  title,
  useSearch,
}: Readonly<{
  columns: Column<T>[];
  defaultQuery: string;
  title: string;
  useSearch: (query: string) => QueryListResult<T>;
}>) {
  const content = useIntlayer("hooksPage");
  const [query, setQuery] = useState(defaultQuery);
  const debounced = useDebounce(query, { wait: 300 });
  const result = useSearch(gateQuery(debounced));
  const state = resultState(result);
  const rows = result.data ?? [];

  return (
    <div className="space-y-3">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={content.searchPlaceholder.value}
      />
      {result.isLoading && (
        <span className="text-muted-foreground text-sm">
          {content.searching}
        </span>
      )}
      {state === "error" && <ResultPanel state="error" />}
      {state === "ok" && (
        <TableCard
          columns={columns}
          data={rows.slice(0, MAX_PREVIEW)}
          rowKey={(row) => row.id}
          title={`${title} (${rows.length})`}
        />
      )}
    </div>
  );
}

export function SimpleListDemo<T extends { id: number }>({
  columns,
  keep,
  title,
  useResult,
}: Readonly<{
  columns: Column<T>[];
  keep?: (row: T) => boolean;
  title: string;
  useResult: () => QueryListResult<T>;
}>) {
  const result = useResult();
  const state = resultState(result);
  const rows = (result.data ?? []).filter((row) => keep?.(row) ?? true);

  return state === "ok" ? (
    <TableCard
      columns={columns}
      data={rows.slice(0, MAX_PREVIEW)}
      rowKey={(row) => row.id}
      title={`${title} (${rows.length})`}
    />
  ) : (
    <ResultPanel state={state} />
  );
}

function gateQuery(value: string): string {
  return value.length > 2 || value.length === 0 ? value : "";
}
