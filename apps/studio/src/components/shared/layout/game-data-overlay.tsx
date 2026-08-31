"use client";

import {
  ChevronRightIcon,
  GaugeIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";
import {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import {
  GAME_SYNC_SERVER_STATUS,
  GAME_SYNC_STEP_ORDER,
  gameSyncPercent,
  getGameSyncStatus,
  subscribeGameSyncStatus,
} from "@/lib/game-data/sync";
import { LogoBackdrop } from "@wowlab/shared/components/common";
import { Button } from "@wowlab/shared/components/ui/button";
import { LogoSpinner } from "@wowlab/shared/components/ui/logo-spinner";
import { Progress } from "@wowlab/shared/components/ui/progress";
import { cn } from "@wowlab/shared/lib/utils";

import { useGameSyncStepLabels } from "./use-game-sync-step-labels";

export function GameDataOverlay() {
  const content = useIntlayer("dashboardLayout");
  const stepLabels = useGameSyncStepLabels();
  const status = useSyncExternalStore(
    subscribeGameSyncStatus,
    getGameSyncStatus,
    () => GAME_SYNC_SERVER_STATUS,
  );
  const [isPersisted, setIsPersisted] = useState<boolean | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let active = true;

    void readPersisted().then((value) => {
      if (active) {
        setIsPersisted(value);
      }
    });

    return () => {
      active = false;
    };
  }, [status.phase]);

  const deleteAllData = useCallback(() => {
    void purgeAllIndexedDb().finally(() => globalThis.location.reload());
  }, []);

  const enablePersist = useCallback(() => {
    const storage = navigator.storage as StorageManager | undefined;

    if (!storage?.persist) {
      return;
    }

    void storage
      .persist()
      .then((granted) => setIsPersisted(granted))
      .catch(() => {});
  }, []);

  if (status.phase === "purging") {
    return (
      <Backdrop>
        <LogoSpinner className="size-7" />
        <h2 className="text-2xl font-semibold tracking-tight">
          {content.gameDataPurging}
        </h2>
      </Backdrop>
    );
  }

  if (status.phase === "downloading") {
    const percent = gameSyncPercent(status);

    return (
      <Backdrop>
        <LogoSpinner className="size-7" />
        <div className="space-y-1.5">
          <h2 className="text-2xl font-semibold tracking-tight">
            {content.gameDataLoadingTitle}
          </h2>
          <p className="text-muted-foreground text-sm">
            {content.gameDataLoadingSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {GAME_SYNC_STEP_ORDER.map((step, index) => (
            <Fragment key={step}>
              {index > 0 ? (
                <ChevronRightIcon className="text-muted-foreground/40 size-3" />
              ) : null}
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  status.currentStep === step
                    ? "text-foreground"
                    : "text-muted-foreground/40",
                )}
              >
                {stepLabels[step]}
              </span>
            </Fragment>
          ))}
        </div>
        <div className="w-full space-y-2">
          <Progress value={percent} className="w-full" />
          <p className="text-muted-foreground font-mono text-xs">
            {content.gameDataDownloading({
              loaded: status.loadedTables,
              total: status.totalTables,
            })}
            {status.currentTable
              ? ` · ${content.gameDataLoadingTable({ table: status.currentTable }).value}`
              : ""}
          </p>
        </div>
      </Backdrop>
    );
  }

  if (status.phase === "error") {
    return (
      <Backdrop>
        <TriangleAlertIcon className="text-destructive size-9" />
        <h2 className="text-2xl font-semibold tracking-tight">
          {content.gameDataError}
        </h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => globalThis.location.reload()}>
            {content.gameDataErrorRetry}
          </Button>
          <Button variant="destructive" onClick={deleteAllData}>
            {content.gameDataErrorReset}
          </Button>
        </div>
      </Backdrop>
    );
  }

  if (isPersisted === false && !isDismissed) {
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
        <div className="bg-card text-card-foreground pointer-events-auto flex max-w-md items-start gap-3 rounded-lg border p-4 shadow-lg">
          <GaugeIcon className="text-primary mt-0.5 size-5 shrink-0" />
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                {content.gameDataPersistTitle}
              </p>
              <p className="text-muted-foreground text-sm">
                {content.gameDataPersistSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={enablePersist}>
                {content.gameDataPersistEnable}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsDismissed(true)}
              >
                {content.gameDataPersistDismiss}
              </Button>
            </div>
          </div>
          <button
            type="button"
            aria-label={content.gameDataPersistDismiss.value}
            onClick={() => setIsDismissed(true)}
            className="text-muted-foreground hover:text-foreground -mr-1 -mt-1 shrink-0"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function Backdrop({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="bg-background fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-8">
      <LogoBackdrop />
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 text-center">
        {children}
      </div>
    </div>
  );
}

function deleteIndexedDb(name: string): Promise<void> {
  return new Promise((resolve) => {
    const request = indexedDB.deleteDatabase(name);
    const done = (): void => resolve();

    request.addEventListener("success", done);
    request.addEventListener("error", done);
    request.addEventListener("blocked", done);
  });
}

function listIndexedDbs(): Promise<IDBDatabaseInfo[]> {
  if (typeof indexedDB.databases !== "function") {
    return Promise.resolve([]);
  }

  return indexedDB.databases().catch(() => []);
}

async function purgeAllIndexedDb(): Promise<void> {
  const databases = await listIndexedDbs();

  await Promise.all(
    databases.map((entry) =>
      entry.name ? deleteIndexedDb(entry.name) : Promise.resolve(),
    ),
  );
}

function readPersisted(): Promise<boolean> {
  const storage = navigator.storage as StorageManager | undefined;

  if (!storage?.persisted) {
    return Promise.resolve(true);
  }

  return storage.persisted().catch(() => true);
}
