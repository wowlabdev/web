"use client";

import { CpuIcon, GaugeIcon, LayersIcon, ZapIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import { useMemo } from "react";

import { useRuntimeStore } from "@/lib/node";
import { StatCard, TableCard } from "@wowlab/shared/components/common";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import { DebugLog } from "./debug-log";
import { useWorkersColumns } from "./use-workers-columns";

type PoolControlsProps = {
  canKill: boolean;
  killLabel: string;
  onKill: () => void;
  onPoolSize: (size: number) => void;
  onRestart: () => void;
  placeholder: string;
  poolOptions: number[];
  poolSize: number;
  restartLabel: string;
};

export function WorkersTab() {
  const content = useIntlayer("runtimePage");
  const fmtNumber = useNumber();
  const killWorker = useRuntimeStore((s) => s.killWorker);
  const restartWorker = useRuntimeStore((s) => s.restartWorker);
  const setWorkerPoolSize = useRuntimeStore((s) => s.setWorkerPoolSize);
  const pool = useRuntimeStore((s) => s.workerMetrics);
  const columns = useWorkersColumns();

  const workers = useMemo(
    () =>
      [...(pool?.workers ?? [])].sort((a, b) =>
        a.workerId.localeCompare(b.workerId, undefined, { numeric: true }),
      ),
    [pool?.workers],
  );

  const poolOptions = useMemo(
    () => Array.from({ length: Math.max(1, workers.length) }, (_, i) => i + 1),
    [workers.length],
  );

  if (!pool) {
    return (
      <div className="space-y-6">
        <p className="text-muted-foreground text-sm">{content.workersEmpty}</p>
        <DebugLog />
      </div>
    );
  }

  const busy = workers.filter((worker) => worker.state === "busy").length;
  const poolSize = pool.poolSize ?? Math.min(4, Math.max(1, workers.length));
  const throughput =
    pool.liveSimsPerSec > 0
      ? pool.liveSimsPerSec
      : Math.round(pool.avgSimsPerSec);
  const cacheTotal = pool.cacheHits + pool.cacheMisses;
  const hitRate =
    cacheTotal > 0 ? ((pool.cacheHits / cacheTotal) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<GaugeIcon className="size-4" />}
          title={content.statThroughput.value}
          value={fmtNumber(throughput)}
          changePercentage={content.statThroughputUnit.value}
        />
        <StatCard
          icon={<CpuIcon className="size-4" />}
          title={content.statWorkers.value}
          value={`${busy}/${workers.length}`}
          changePercentage={content.statWorkersBusy.value}
        />
        <StatCard
          icon={<LayersIcon className="size-4" />}
          title={content.statTotalSims.value}
          value={fmtNumber(pool.totalIterations)}
          changePercentage={content.statUnitIterations.value}
        />
        <StatCard
          icon={<ZapIcon className="size-4" />}
          title={content.statCacheHitRate.value}
          value={`${hitRate}%`}
          changePercentage={content.statCacheCaption.value}
        />
      </div>

      <TableCard
        title={content.workersTitle}
        data={workers}
        rowKey={(worker) => worker.workerId}
        headerActions={
          <PoolControls
            poolSize={poolSize}
            poolOptions={poolOptions}
            placeholder={content.poolSize.value}
            killLabel={content.kill.value}
            restartLabel={content.restart.value}
            canKill={pool.state !== "idle" && pool.state !== "terminated"}
            onPoolSize={setWorkerPoolSize}
            onKill={killWorker}
            onRestart={restartWorker}
          />
        }
        columns={columns}
      />

      <DebugLog />
    </div>
  );
}

function PoolControls({
  canKill,
  killLabel,
  onKill,
  onPoolSize,
  onRestart,
  placeholder,
  poolOptions,
  poolSize,
  restartLabel,
}: Readonly<PoolControlsProps>) {
  const content = useIntlayer("runtimePage");

  return (
    <>
      <Select
        value={String(poolSize)}
        onValueChange={(value) => {
          const parsed = Number.parseInt(value, 10);

          if (Number.isFinite(parsed)) {
            onPoolSize(parsed);
          }
        }}
      >
        <SelectTrigger className="h-8 min-w-28 text-xs">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {poolOptions.map((value) => (
            <SelectItem key={value} value={String(value)}>
              {value} {content.statWorkers.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-xs"
        onClick={onRestart}
      >
        {restartLabel}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="h-8 text-xs"
        disabled={!canKill}
        onClick={onKill}
      >
        {killLabel}
      </Button>
    </>
  );
}
