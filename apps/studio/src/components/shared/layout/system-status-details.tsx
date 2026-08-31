"use client";

import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer";
import commonPkg from "wowlab-common/package.json";
import enginePkg from "wowlab-engine/package.json";

import type { GameSyncStatus } from "@/lib/game-data/sync";
import type { ResolveActivityDetail } from "@/lib/state/resolve-activity-store";
import type { StatusTone } from "@wowlab/shared/components/common";

import { GAME_SYNC_STEP_ORDER, gameSyncPercent } from "@/lib/game-data/sync";
import { Progress } from "@wowlab/shared/components/ui/progress";
import { Table, TableBody } from "@wowlab/shared/components/ui/table";
import { useClipboard } from "@wowlab/shared/hooks/use-clipboard";
import { cn } from "@wowlab/shared/lib/utils";

import { SystemActivityRow } from "./system-activity-row";
import { SystemStatusRow } from "./system-status-row";
import { useGameSyncStepLabels } from "./use-game-sync-step-labels";

type SystemStatusDetailsProps = {
  commonTone: StatusTone;
  detail: ResolveActivityDetail | null;
  engineTone: StatusTone;
  fetched: number;
  isBusy: boolean;
  isSyncPulsing: boolean;
  sync: GameSyncStatus;
  syncTone: StatusTone;
};

export function SystemStatusDetails({
  commonTone,
  detail,
  engineTone,
  fetched,
  isBusy,
  isSyncPulsing,
  sync,
  syncTone,
}: Readonly<SystemStatusDetailsProps>) {
  const content = useIntlayer("dashboardLayout");
  const { copy } = useClipboard();
  const isDownloading = sync.phase === "downloading";
  const percent = gameSyncPercent(sync);
  const gameDataHeadline = {
    checking: content.gameDataChecking,
    downloading: content.gameDataDownloading({
      loaded: sync.loadedTables,
      total: sync.totalTables,
    }),
    error: content.gameDataError,
    idle: content.gameDataIdle,
    purging: content.gameDataPurging,
    ready: content.gameDataReady,
  }[sync.phase];

  return (
    <Table>
      <TableBody>
        <SystemStatusRow
          label="common"
          tone={commonTone}
          value={
            <CopyValue onCopy={() => copy(commonPkg.version)}>
              v{commonPkg.version}
            </CopyValue>
          }
        />
        <SystemStatusRow
          label="engine"
          tone={engineTone}
          value={
            <CopyValue onCopy={() => copy(enginePkg.version)}>
              v{enginePkg.version}
            </CopyValue>
          }
        />
        <SystemStatusRow
          detail={
            isDownloading ? (
              <GameDataDetail percent={percent} sync={sync} />
            ) : null
          }
          isPulsing={isSyncPulsing}
          label={content.gameDataLabel}
          tone={syncTone}
          value={isDownloading ? `${percent}%` : gameDataHeadline}
        />
        <SystemActivityRow detail={detail} fetched={fetched} isBusy={isBusy} />
      </TableBody>
    </Table>
  );
}

function CopyValue({
  children,
  onCopy,
}: Readonly<{
  children: ReactNode;
  onCopy: () => void;
}>) {
  return (
    <button
      className="hover:text-foreground font-mono transition-colors"
      onClick={onCopy}
      type="button"
    >
      {children}
    </button>
  );
}

function GameDataDetail({
  percent,
  sync,
}: Readonly<{
  percent: number;
  sync: GameSyncStatus;
}>) {
  const content = useIntlayer("dashboardLayout");
  const stepLabels = useGameSyncStepLabels();

  return (
    <>
      {sync.currentTable ? (
        <span className="font-mono">
          {content.gameDataLoadingTable({ table: sync.currentTable })}
        </span>
      ) : null}
      <span className="flex items-center gap-1 font-mono">
        {GAME_SYNC_STEP_ORDER.map((step) => (
          <span
            className={cn(
              sync.currentStep === step
                ? "text-foreground"
                : "text-muted-foreground/40",
            )}
            key={step}
          >
            {stepLabels[step]}
          </span>
        ))}
      </span>
      <Progress value={percent} />
    </>
  );
}
