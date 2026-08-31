"use client";

import { useBoolean, useMemoizedFn } from "ahooks";
import {
  DatabaseIcon,
  HardDriveIcon,
  HashIcon,
  RefreshCwIcon,
  TableIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import prettyBytes from "pretty-bytes";
import { useEffect, useState, useSyncExternalStore } from "react";

import { useReseedGameData } from "@/components/shared/islands/game-data-island";
import { useConfirm } from "@/components/shared/ui/confirm-dialog";
import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import {
  getGameSyncStatus,
  subscribeGameSyncStatus,
} from "@/lib/game-data/sync";
import { StatCard, TableCard } from "@wowlab/shared/components/common";
import { Button } from "@wowlab/shared/components/ui/button";
import { Input } from "@wowlab/shared/components/ui/input";
import { cn } from "@wowlab/shared/lib/utils";

import { DatabaseDetails } from "./database-details";
import { useDatabaseColumns } from "./use-database-columns";
import { useGameTableStats } from "./use-game-table-stats";
import { useNa } from "./use-na";

export function DatabaseTab() {
  const content = useIntlayer("runtimePage");
  const confirm = useConfirm();
  const fmtNumber = useNumber();
  const { na, orNa } = useNa();
  const { data, loading, refresh } = useGameTableStats();
  const reseed = useReseedGameData();
  const [query, setQuery] = useState("");
  const [purging, { setFalse: stopPurge, setTrue: startPurge }] =
    useBoolean(false);

  const syncPhase = useSyncExternalStore(
    subscribeGameSyncStatus,
    () => getGameSyncStatus().phase,
    () => "idle",
  );

  useEffect(() => {
    if (syncPhase === "ready") {
      refresh();
    }
  }, [syncPhase, refresh]);

  const handlePurge = useMemoizedFn(async () => {
    if (!reseed) {
      return;
    }

    const confirmed = await confirm({
      confirmLabel: content.purge,
      description: content.purgeConfirm,
      isDestructive: true,
    });

    if (!confirmed) {
      return;
    }

    startPurge();

    try {
      await reseed();
    } finally {
      stopPurge();
    }
  });

  const storageCaption =
    data?.quota == null
      ? na
      : content.storageOfQuota({
          percent:
            data.usage == null
              ? 0
              : Math.round((data.usage / data.quota) * 100),
          total: prettyBytes(data.quota),
        }).value;

  const filteredTables = useFuzzySearch({
    items: data?.tables ?? [],
    keys: ["name"],
    query,
  });

  const quotaPercent =
    data && data.usage != null && data.quota != null && data.quota > 0
      ? Math.round((data.usage / data.quota) * 100)
      : null;

  const columns = useDatabaseColumns({ data });

  return (
    <div className="space-y-6">
      {quotaPercent != null && quotaPercent >= 80 ? (
        <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm">
          <TriangleAlertIcon className="size-4 shrink-0" />
          <span>{content.quotaWarning({ percent: quotaPercent })}</span>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<TableIcon className="size-4" />}
          title={content.statTables.value}
          value={orNa(data?.tables.length, fmtNumber)}
          changePercentage={content.statTablesCaption.value}
        />
        <StatCard
          icon={<DatabaseIcon className="size-4" />}
          title={content.statRows.value}
          value={orNa(data?.totalRows, fmtNumber)}
          changePercentage={content.statRowsCaption.value}
        />
        <StatCard
          icon={<HardDriveIcon className="size-4" />}
          title={content.statStorage.value}
          value={orNa(data?.usage, prettyBytes)}
          changePercentage={data ? storageCaption : na}
        />
        <StatCard
          icon={<HashIcon className="size-4" />}
          title={content.statRevision.value}
          value={orNa(data?.revision, (revision) => `#${revision}`)}
          changePercentage={
            data?.patchVersion ?? content.statRevisionCaption.value
          }
        />
      </div>

      <TableCard
        title={content.databaseTitle}
        data={filteredTables}
        rowKey={(table) => table.name}
        headerActions={
          <>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={content.searchPlaceholder.value}
              className="h-8 w-44 text-xs"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              disabled={loading || purging}
              onClick={refresh}
            >
              <RefreshCwIcon
                className={cn("size-3.5", loading && "animate-spin")}
              />
              {content.refresh}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive h-8 text-xs"
              disabled={purging || !reseed}
              onClick={() => void handlePurge()}
            >
              <Trash2Icon
                className={cn("size-3.5", purging && "animate-pulse")}
              />
              {content.purge}
            </Button>
          </>
        }
        columns={columns}
      />

      <DatabaseDetails data={data} />
    </div>
  );
}
