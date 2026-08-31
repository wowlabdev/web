"use client";

import { useMemoizedFn, useMount, useSafeState } from "ahooks";
import { createContext, type ReactNode, use, useEffect, useMemo } from "react";

import type { GameDb } from "@/lib/game-data/store";

import { resetBulkMemory } from "@/lib/game-data/bulk-store";
import { getGameDb, purgeGameDb } from "@/lib/game-data/store";
import { setSyncPurging } from "@/lib/game-data/sync";
import {
  resetGameDataSync,
  runGameDataSync,
} from "@/lib/game-data/sync-runner";
import {
  primeBulkBuffer,
  resetBulkBuffer,
} from "@/lib/node/game-data-provider";
import {
  resetResolutionWorker,
  warmResolutionWorker,
} from "@/lib/node/resolution-worker-client";
import { useRuntimeStore } from "@/lib/node/runtime-store";
import { log } from "@/lib/observability";

export type GameDataContextValue = {
  gameDb: GameDb;
  reseed: () => Promise<void>;
};

type GameData = Pick<GameDataContextValue, "gameDb">;

const GameDataContext = createContext<GameDataContextValue | null>(null);

let syncStarted = false;

type GameDataIslandProps = {
  children: ReactNode;
};

export function GameDataIsland({ children }: Readonly<GameDataIslandProps>) {
  const [data, setData] = useSafeState<GameData | null>(null);

  const init = useMemoizedFn(async () => {
    const db = await getGameDb();

    setData({ gameDb: db });
  });

  const reseed = useMemoizedFn(async () => {
    setData(null);
    syncStarted = true;
    setSyncPurging();
    resetGameDataSync();
    resetBulkBuffer();
    resetBulkMemory();
    resetResolutionWorker();
    await purgeGameDb();
    await init();
    await runGameDataSync(await getGameDb());
    useRuntimeStore.getState().reprimeWorker();
  });

  useMount(() => {
    void init();
  });

  const value = useMemo<GameDataContextValue | null>(
    () => (data ? { ...data, reseed } : null),
    [data, reseed],
  );

  return <GameDataContext value={value}>{children}</GameDataContext>;
}

export function useGameData(): GameDataContextValue | null {
  const ctx = use(GameDataContext);

  useEffect(() => {
    if (ctx) {
      startSyncOnce(ctx.gameDb);
    }
  }, [ctx]);

  return ctx;
}

export function useReseedGameData(): (() => Promise<void>) | undefined {
  return use(GameDataContext)?.reseed;
}

function scheduleIdle(callback: () => void): void {
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(callback);

    return;
  }

  setTimeout(callback, 0);
}

function startSyncOnce(db: GameDb): void {
  if (syncStarted) {
    return;
  }

  syncStarted = true;
  scheduleIdle(() => {
    runGameDataSync(db)
      .then(() => {
        primeBulkBuffer();
        warmResolutionWorker();
      })
      .catch((error: unknown) => {
        log.withError(error).error("Game data sync failed");
      });
  });
}
