"use client";

import { useSafeState, useThrottleEffect } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import { useMemo, useRef } from "react";

import type { JobRow } from "@/lib/query/services/jobs";

import { AreaChart } from "@/components/shared/ui/charts";
import { useRuntimeStore } from "@/lib/node";
import { getJobMeta } from "@/lib/query/services/jobs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

type ChartPoint = {
  activeWorkers: number;
  elapsed: number;
  label: string;
  simsPerSec: number;
};

type ThroughputChartProps = {
  job: JobRow;
};

export function ThroughputChart({ job }: Readonly<ThroughputChartProps>) {
  const content = useIntlayer("throughputChart");
  const fmtNumber = useNumber();
  const m = useRuntimeStore((s) => s.workerMetrics);
  const [chartData, setChartData] = useSafeState<ChartPoint[]>([]);
  const startRef = useRef(0);
  const prevCompletedRef = useRef(0);

  const { activeWorkerCount, liveCompleted, liveRate, liveTotal } =
    useMemo(() => {
      const workers =
        m?.workers?.filter(
          (worker) =>
            worker.state === "busy" &&
            worker.currentPhase === "simulating" &&
            worker.currentJobId === job.id,
        ) ?? [];

      return {
        activeWorkerCount: workers.length,
        liveCompleted: workers.reduce(
          (sum, worker) => sum + worker.liveCompleted,
          0,
        ),
        liveRate: workers.reduce(
          (sum, worker) => sum + worker.liveSimsPerSec,
          0,
        ),
        liveTotal: workers.reduce((sum, worker) => sum + worker.liveTotal, 0),
      };
    }, [m?.workers, job.id]);

  const measuredAt = m?.measuredAt ?? 0;

  useThrottleEffect(
    () => {
      if (liveRate <= 0 || measuredAt <= 0) {
        return;
      }

      if (prevCompletedRef.current === liveCompleted) {
        return;
      }

      prevCompletedRef.current = liveCompleted;

      if (startRef.current === 0) {
        startRef.current = measuredAt;
      }

      const elapsed = (measuredAt - startRef.current) / 1000;

      setChartData((prev) => [
        ...prev,
        {
          activeWorkers: activeWorkerCount,
          elapsed,
          label: `${fmtNumber(elapsed, { maximumFractionDigits: 0 })}s`,
          simsPerSec: liveRate,
        },
      ]);
    },
    [
      activeWorkerCount,
      fmtNumber,
      liveCompleted,
      liveRate,
      measuredAt,
      setChartData,
    ],
    { wait: 1000 },
  );

  if (chartData.length === 0) {
    if (
      getJobMeta(job).status !== "running" &&
      getJobMeta(job).status !== "pending"
    ) {
      return null;
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{content.speed}</CardTitle>
          <CardDescription>{content.waitingForData}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const currentRate = chartData.at(-1)?.simsPerSec ?? 0;
  const currentWorkers = chartData.at(-1)?.activeWorkers ?? 0;
  const peakWorkers = Math.max(
    ...chartData.map((point) => point.activeWorkers),
  );
  const avgRate = Math.round(
    chartData.reduce((sum, p) => sum + p.simsPerSec, 0) / chartData.length,
  );

  const progress =
    liveTotal > 0
      ? `${fmtNumber(liveCompleted)} / ${fmtNumber(liveTotal)}`
      : null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{content.speed}</CardTitle>
            <CardDescription>
              {progress
                ? `${progress} ${content.iterations}`
                : content.simulationsPerSecond}
            </CardDescription>
          </div>
          <div className="flex gap-4 text-right text-sm">
            <div>
              <p className="text-muted-foreground">{content.current}</p>
              <p className="font-mono font-medium tabular-nums">
                {fmtNumber(currentRate)}
                /s
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">{content.average}</p>
              <p className="font-mono font-medium tabular-nums">
                {fmtNumber(avgRate)}
                /s
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">{content.workers}</p>
              <p className="font-mono font-medium tabular-nums">
                {currentWorkers}/{peakWorkers}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AreaChart
          analytics={{ enabled: false }}
          data={chartData}
          height={160}
          rightAxisDataKey="activeWorkers"
          rightYAxis={{ allowDecimals: false, width: 30 }}
          series={[
            {
              color: "var(--chart-1)",
              dataKey: "simsPerSec",
              label: content.speed.value,
            },
            {
              color: "var(--chart-2)",
              dataKey: "activeWorkers",
              label: content.activeWorkers.value,
            },
          ]}
          xAxis={{ dataKey: "label" }}
          yAxis={{ tickFormatter: fmtNumber, width: 50 }}
        />
      </CardContent>
    </Card>
  );
}
