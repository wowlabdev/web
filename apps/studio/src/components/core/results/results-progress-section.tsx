"use client";

import { ActivityIcon, TrendingUpIcon, TrophyIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import { useMemo } from "react";

import type { JobRow } from "@/lib/query/services/jobs";
import type { JobProgressPayload } from "@/lib/realtime/job-progress";

import { getJobMeta } from "@/lib/query/services/jobs";
import { useJobProgress } from "@/lib/realtime/job-progress";
import { StatCard } from "@wowlab/shared/components/common/stat-card";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { Progress } from "@wowlab/shared/components/ui/progress";

type ResultsProgressSectionProps = {
  job: JobRow;
};

type TopRow = {
  iterations: number;
  meanDps: number;
  permIdx: number;
  rank: number;
  share: number;
};

export function ResultsProgressSection({
  job,
}: Readonly<ResultsProgressSectionProps>) {
  const content = useIntlayer("resultsPage");
  const fmtNumber = useNumber();
  const meta = getJobMeta(job);
  const isActive = meta.status === "pending" || meta.status === "running";

  const { progress } = useJobProgress(job.id, { isEnabled: isActive });

  const live: JobProgressPayload | null = isActive ? progress : null;

  const topRows = useMemo<TopRow[]>(() => {
    const topK = live?.topK ?? [];
    const best = topK.reduce((max, p) => Math.max(max, p.meanDpsX10), 0);

    return topK
      .map((p) => ({
        iterations: p.iterations,
        meanDps: p.meanDpsX10 / 10,
        permIdx: p.permIdx,
        rank: 0,
        share: best > 0 ? (p.meanDpsX10 / best) * 100 : 0,
      }))
      .sort((a, b) => b.meanDps - a.meanDps)
      .map((row, index) => ({ ...row, rank: index + 1 }));
  }, [live]);

  if (!isActive) {
    return null;
  }

  const rounded = (value: number) =>
    fmtNumber(value, { maximumFractionDigits: 0 });

  const chunkPct =
    live && live.chunksTotal > 0
      ? Math.min(100, (live.chunksCompleted / live.chunksTotal) * 100)
      : 0;

  const statusLabel =
    meta.status === "pending"
      ? content.currentStatusPending
      : content.currentStatusRunning;

  return (
    <div className="space-y-4">
      <Card className="mb-2">
        <CardContent className="flex flex-col gap-3 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{statusLabel}</span>
            <Badge className="gap-1">
              <ActivityIcon className="size-3" />
              {content.liveBadge}
            </Badge>
          </div>
          {live && (
            <>
              <Progress value={chunkPct} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="tabular-nums">
                  {rounded(live.chunksCompleted)} /{rounded(live.chunksTotal)}
                </span>
                {live.phase !== undefined && live.phaseCount !== undefined && (
                  <span>
                    {content.phaseProgress({
                      phase: live.phase + 1,
                      total: live.phaseCount,
                    })}
                  </span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {live &&
        (live.topMeanDpsX10 !== undefined ||
          live.permutationsActive !== undefined) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {live.topMeanDpsX10 !== undefined && (
              <StatCard
                icon={<TrendingUpIcon className="size-4" />}
                value={rounded(live.topMeanDpsX10 / 10)}
                title={content.tournamentBestDps.value}
                changePercentage={content.tournamentRunning.value}
              />
            )}
            {live.permutationsActive !== undefined && (
              <StatCard
                icon={<TrophyIcon className="size-4" />}
                value={rounded(live.permutationsActive)}
                title={content.tournamentPermutations.value}
                changePercentage={content.tournamentRunning.value}
              />
            )}
          </div>
        )}

      {topRows.length > 0 && (
        <TableCard<TopRow>
          title={content.liveTopRanking.value}
          columns={[
            {
              cell: (row) => <span className="font-mono">#{row.rank}</span>,
              header: content.tournamentRank.value,
            },
            {
              cell: (row) => (
                <span className="font-mono text-muted-foreground">
                  {row.permIdx}
                </span>
              ),
              header: content.tournamentItem.value,
            },
            {
              cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                  <Progress value={row.share} className="w-24" />
                  <span className="font-mono tabular-nums">
                    {rounded(row.meanDps)}
                  </span>
                </div>
              ),
              className: "text-right",
              header: content.dps.value,
            },
            {
              cell: (row) => (
                <span className="font-mono tabular-nums text-muted-foreground">
                  {rounded(row.iterations)}
                </span>
              ),
              className: "text-right",
              header: content.iterations.value,
            },
          ]}
          data={topRows}
          rowKey={(row) => row.permIdx}
        />
      )}
    </div>
  );
}
