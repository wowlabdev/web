"use client";

import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import type { WorkerMetrics } from "@/lib/node/worker-metrics";

import { useRuntimeStore, WORKER_STATE_VARIANTS } from "@/lib/node";
import { FormattedBytes } from "@wowlab/shared/components/common";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";

type WorkerColumn = {
  cell: (worker: WorkerMetrics) => ReactNode;
  className?: string;
  header: string;
};

export function useWorkersColumns(): WorkerColumn[] {
  const content = useIntlayer("runtimePage");
  const fmtNumber = useNumber();
  const setWorkerEnabled = useRuntimeStore((s) => s.setWorkerEnabled);

  return [
    {
      cell: (worker) => (
        <span className="font-mono text-xs">{worker.workerId}</span>
      ),
      header: content.colWorker.value,
    },
    {
      cell: (worker) => (
        <Badge
          variant={WORKER_STATE_VARIANTS[worker.state] ?? "secondary"}
          className="px-1.5 py-0 text-[10px]"
        >
          {(worker.currentPhase
            ? `${worker.state} · ${worker.currentPhase}`
            : worker.state
          ).toUpperCase()}
        </Badge>
      ),
      header: content.colState.value,
    },
    {
      cell: (worker) => (
        <span className="font-mono text-xs">
          {fmtNumber(
            worker.liveSimsPerSec > 0
              ? worker.liveSimsPerSec
              : Math.round(worker.avgSimsPerSec),
          )}
        </span>
      ),
      className: "text-right tabular-nums",
      header: content.colThroughput.value,
    },
    {
      cell: (worker) => (
        <span className="font-mono text-xs">
          {worker.chunksCompleted} / {worker.chunksFailed}
        </span>
      ),
      className: "text-right tabular-nums",
      header: content.colChunks.value,
    },
    {
      cell: (worker) => (
        <span className="font-mono text-xs">
          <FormattedBytes value={worker.wasmHeapBytes} />
        </span>
      ),
      className: "text-right tabular-nums",
      header: content.colHeap.value,
    },
    {
      cell: (worker) => (
        <Button
          variant={worker.isEnabled === false ? "secondary" : "ghost"}
          size="sm"
          className="h-7 text-xs"
          onClick={() =>
            setWorkerEnabled(worker.workerId, worker.isEnabled === false)
          }
        >
          {worker.isEnabled === false ? content.enable : content.disable}
        </Button>
      ),
      className: "text-right",
      header: "",
    },
  ];
}
