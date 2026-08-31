"use client";

import type { AnalyticsView } from "wowlab-common";

import { useCreation } from "ahooks";
import { useIntlayer } from "next-intlayer";

import { useCommon } from "@/components/shared/wasm";
import { getJobMeta, useJob } from "@/lib/query/services/jobs";
import { decodeJobResult } from "@/lib/wasm/api";
import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { Link } from "@wowlab/shared/components/ui/link";

import { ResultsDpsStatsCard } from "./results-dps-stats-card";
import { ResultsErrorCard } from "./results-error-card";
import { ResultsJobDetailsCard } from "./results-job-details-card";
import { ResultsPageSkeleton } from "./results-page-skeleton";
import { ResultsProgressSection } from "./results-progress-section";
import { ResultsSimConfigCard } from "./results-sim-config-card";
import { ResultsSpellBreakdownTable } from "./results-spell-breakdown-table";
import { ThroughputChart } from "./throughput-chart";
import { TournamentResultView } from "./tournament/tournament-result-view";

type ResultsContentProps = {
  jobId: string;
};

export function ResultsContent({ jobId }: Readonly<ResultsContentProps>) {
  const content = useIntlayer("resultsPage");
  const { data: job, error, isLoading } = useJob(jobId);
  const common = useCommon();

  const jobResult = useCreation(() => {
    if (!job?.result_pb) {
      return null;
    }

    return decodeJobResult(common, job);
  }, [common, job]);

  if (isLoading) {
    return <ResultsPageSkeleton />;
  }

  if (error || !job) {
    return <ResultsErrorCard message={error?.message} />;
  }

  const tournamentResult = jobResult?.kind === "tournament" ? jobResult : null;
  const analytics: AnalyticsView | null =
    jobResult?.kind === "single"
      ? jobResult.analytics
      : (tournamentResult?.analytics ?? null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href="/">{content.runAnother}</Link>
        </Button>
      </div>

      {getJobMeta(job).status === "failed" && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-4">
            <p className="text-sm text-destructive">
              {content.simulationFailed}
            </p>
          </CardContent>
        </Card>
      )}

      <ResultsProgressSection job={job} />

      {tournamentResult && (
        <TournamentResultView
          tournament={tournamentResult.tournament}
          spec={String(getJobMeta(job).spec_id)}
          jobId={jobId}
        />
      )}

      <ThroughputChart job={job} />

      {analytics && <ResultsDpsStatsCard core={analytics.core} job={job} />}

      {analytics && analytics.actions.length > 0 && (
        <ResultsSpellBreakdownTable
          actions={analytics.actions}
          analytics={analytics}
        />
      )}

      <ResultsJobDetailsCard job={job} />

      {job.sim_config && <ResultsSimConfigCard simConfig={job.sim_config} />}
    </div>
  );
}
