"use client";

import { useIntlayer } from "next-intlayer";
import { useSyncExternalStore } from "react";

import type { GameSyncPhase } from "@/lib/game-data/sync";
import type { ResolveActivityDetail } from "@/lib/state/resolve-activity-store";
import type { WasmPhase } from "@/lib/wasm/status";
import type { StatusTone } from "@wowlab/shared/components/common";

import {
  GAME_SYNC_SERVER_STATUS,
  gameSyncPercent,
  getGameSyncStatus,
  subscribeGameSyncStatus,
} from "@/lib/game-data/sync";
import {
  isResolveBusy,
  useResolveActivityStore,
} from "@/lib/state/resolve-activity-store";
import { useWasmStatus } from "@/lib/wasm/use-wasm-status";
import { StatusDot } from "@wowlab/shared/components/common";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@wowlab/shared/components/ui/popover";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@wowlab/shared/components/ui/sidebar";

import { SystemStatusDetails } from "./system-status-details";
import { useActivityDetail } from "./use-activity-detail";

const WASM_TONE: Record<WasmPhase, StatusTone> = {
  error: "danger",
  idle: "muted",
  loading: "pending",
  ready: "success",
};

const SYNC_TONE = {
  checking: "pending",
  downloading: "pending",
  error: "danger",
  idle: "muted",
  purging: "pending",
  ready: "success",
} as const;

export function SystemStatusIndicator() {
  const content = useIntlayer("dashboardLayout");
  const { common, engine } = useWasmStatus();
  const sync = useSyncExternalStore(
    subscribeGameSyncStatus,
    getGameSyncStatus,
    () => GAME_SYNC_SERVER_STATUS,
  );
  const busy = useResolveActivityStore(isResolveBusy);
  const fetched = useResolveActivityStore((s) => s.fetched);
  const detail = useResolveActivityStore((s) => s.detail);
  const isDownloading = sync.phase === "downloading";
  const percent = gameSyncPercent(sync);

  return (
    <SidebarMenuItem>
      <Popover>
        <PopoverTrigger asChild>
          <SidebarMenuButton className="text-muted-foreground hover:text-foreground h-7 justify-start gap-2.5 font-mono text-[10px]">
            {busy ? (
              <ActivityBar detail={detail} fetched={fetched} />
            ) : (
              <StatusBar
                common={common}
                engine={engine}
                isDownloading={isDownloading}
                percent={percent}
                syncPhase={sync.phase}
              />
            )}
          </SidebarMenuButton>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-0" side="top">
          <PopoverHeader className="px-3 py-2.5">
            <PopoverTitle className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
              {content.systemTitle}
            </PopoverTitle>
          </PopoverHeader>

          <SystemStatusDetails
            commonTone={WASM_TONE[common]}
            detail={detail}
            engineTone={WASM_TONE[engine]}
            fetched={fetched}
            isBusy={busy}
            isSyncPulsing={SYNC_TONE[sync.phase] === "pending"}
            sync={sync}
            syncTone={SYNC_TONE[sync.phase]}
          />
        </PopoverContent>
      </Popover>
    </SidebarMenuItem>
  );
}

function ActivityBar({
  detail,
  fetched,
}: Readonly<{
  detail: ResolveActivityDetail | null;
  fetched: number;
}>) {
  const content = useIntlayer("dashboardLayout");
  const label = useActivityDetail(detail);

  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <StatusDot isPulsing tone="pending" />
      <span className="truncate">{label ?? content.activityLabel}</span>
      {fetched > 0 ? (
        <span className="text-muted-foreground/70 tabular-nums">{fetched}</span>
      ) : null}
    </span>
  );
}

function StatusBar({
  common,
  engine,
  isDownloading,
  percent,
  syncPhase,
}: Readonly<{
  common: WasmPhase;
  engine: WasmPhase;
  isDownloading: boolean;
  percent: number;
  syncPhase: GameSyncPhase;
}>) {
  const content = useIntlayer("dashboardLayout");

  return (
    <>
      <span className="flex items-center gap-1">
        <StatusDot tone={WASM_TONE[common]} />
        common
      </span>
      <span className="flex items-center gap-1">
        <StatusDot tone={WASM_TONE[engine]} />
        engine
      </span>
      <span className="flex items-center gap-1">
        <StatusDot
          isPulsing={SYNC_TONE[syncPhase] === "pending"}
          tone={SYNC_TONE[syncPhase]}
        />
        {content.gameDataLabel}
        {isDownloading ? (
          <span className="tabular-nums">{percent}%</span>
        ) : null}
      </span>
    </>
  );
}
