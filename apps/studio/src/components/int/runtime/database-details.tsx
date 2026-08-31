"use client";

import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer";

import { FormattedBytes, RelativeTime } from "@wowlab/shared/components/common";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

import type { GameStorageStats } from "./use-game-table-stats";

import { useNa } from "./use-na";

type DatabaseDetailsProps = {
  data: GameStorageStats | undefined;
};

export function DatabaseDetails({ data }: Readonly<DatabaseDetailsProps>) {
  const content = useIntlayer("runtimePage");
  const { na, orNa } = useNa();

  const rows: { key: string; label: ReactNode; value: ReactNode }[] = [
    {
      key: "synced",
      label: content.detailSynced,
      value: data?.syncedAt ? (
        <RelativeTime at={data.syncedAt} isTicking fallback={na} />
      ) : (
        na
      ),
    },
    {
      key: "snapshot",
      label: content.detailSnapshotSize,
      value:
        data?.snapshotBytes == null ? (
          na
        ) : (
          <FormattedBytes value={data.snapshotBytes} />
        ),
    },
    {
      key: "persisted",
      label: content.detailPersisted,
      value: orNa(data?.persisted, (persisted) =>
        persisted
          ? content.storagePersistent.value
          : content.storageBestEffort.value,
      ),
    },
    {
      key: "leader",
      label: content.detailLeader,
      value: orNa(data?.isLeader, (leader) =>
        leader ? content.detailYes.value : content.detailNo.value,
      ),
    },
    {
      key: "stores",
      label: content.detailIdbStores,
      value: orNa(data?.idbStoreCount),
    },
    {
      key: "engine",
      label: content.detailEngine,
      value: <span className="font-mono">Dexie / IndexedDB</span>,
    },
    {
      key: "name",
      label: content.detailDbName,
      value: <span className="font-mono">{orNa(data?.dbName)}</span>,
    },
  ];

  if (data?.usageIndexedDb != null) {
    rows.splice(5, 0, {
      key: "idb-usage",
      label: content.detailIdbUsage,
      value: <FormattedBytes value={data.usageIndexedDb} />,
    });
  }

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-sm">{content.detailsTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-x-8 sm:grid-cols-2">
          {rows.map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between gap-4 border-b py-2 text-sm last:border-b-0"
            >
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
