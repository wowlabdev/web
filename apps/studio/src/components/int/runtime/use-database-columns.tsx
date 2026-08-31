"use client";

import type { ReactNode } from "react";

import { SearchIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { cn } from "@wowlab/shared/lib/utils";

import type { GameStorageStats, GameTableStat } from "./use-game-table-stats";

import { gameTableSourceUrl, gameTableStructName } from "./game-table-source";
import { useNa } from "./use-na";

type GameTableColumn = {
  cell: (table: GameTableStat) => ReactNode;
  className?: string;
  header: string;
};

type UseDatabaseColumnsArgs = {
  data: GameStorageStats | undefined;
};

export function useDatabaseColumns({
  data,
}: UseDatabaseColumnsArgs): GameTableColumn[] {
  const content = useIntlayer("runtimePage");
  const fmtNumber = useNumber();
  const { na } = useNa();

  return [
    {
      cell: (table) => (
        <span className="inline-flex items-center gap-2 font-mono text-xs">
          <TableHealthDot table={table} />
          {table.name}
          <a
            href={gameTableSourceUrl(table.name)}
            target="_blank"
            rel="noopener noreferrer"
            title={gameTableStructName(table.name)}
            aria-label={content.sourceLink.value}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SearchIcon className="size-3" />
          </a>
        </span>
      ),
      header: content.colTable.value,
    },
    {
      cell: (table) => <TableTypeBadge table={table} />,
      header: content.colType.value,
    },
    {
      cell: (table) => (
        <span className="font-mono text-xs">{fmtNumber(table.count)}</span>
      ),
      className: "text-right tabular-nums",
      header: content.colEntries.value,
    },
    {
      cell: (table) => (
        <span className="text-muted-foreground font-mono text-xs">
          {data && data.totalRows > 0
            ? `${((table.count / data.totalRows) * 100).toFixed(1)}%`
            : na}
        </span>
      ),
      className: "text-right tabular-nums",
      header: content.colShare.value,
    },
  ];
}

function TableHealthDot({ table }: Readonly<{ table: GameTableStat }>) {
  const content = useIntlayer("runtimePage");

  let className = "bg-green-500";
  let label: string = content.healthOk.value;

  if (table.count === 0) {
    if (table.group === "bulk") {
      className = "bg-red-500";
      label = content.healthEmpty.value;
    } else {
      className = "bg-muted-foreground/40";
      label = content.healthIdle.value;
    }
  }

  return (
    <span
      title={label}
      className={cn("inline-block size-2 shrink-0 rounded-full", className)}
    />
  );
}

function TableTypeBadge({ table }: Readonly<{ table: GameTableStat }>) {
  const content = useIntlayer("runtimePage");

  return table.group === "bulk" ? (
    <Badge variant="secondary" className="text-[10px]">
      {content.typeBulk}
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground text-[10px]">
      {content.typeOnDemand}
    </Badge>
  );
}
