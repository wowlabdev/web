"use client";

import type { CoreView } from "wowlab-common";

import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import type { JobRow } from "@/lib/query/services/jobs";

import { getJobMeta } from "@/lib/query/services/jobs";
import { Badge, type BadgeVariant } from "@wowlab/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

import type { ResultsPageContent } from "./results-page-content";

import { ResultsStatCell } from "./results-stat-cell";

type ResultsDpsStatsCardProps = {
  core: CoreView;
  job: JobRow;
};

export function ResultsDpsStatsCard({
  core,
  job,
}: Readonly<ResultsDpsStatsCardProps>) {
  const content = useIntlayer("resultsPage");
  const fmtNumber = useNumber();
  const confidence = getConfidence(core.ci95_half_pct, content);
  const isFinalized = getJobMeta(job).status === "completed";

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{content.dps}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={confidence.variant}>{confidence.label}</Badge>
            <Badge variant={isFinalized ? "default" : "outline"}>
              {isFinalized ? content.finalized : content.provisional}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-4xl font-bold tabular-nums">
            {fmtNumber(core.mean_dps, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-sm text-muted-foreground">
            CI {"\u00B1"}
            {core.ci95_half_pct.toFixed(2)}%
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          {[
            { label: content.min.value, value: core.min_dps },
            { label: content.max.value, value: core.max_dps },
            { label: content.stdDev.value, value: core.std_dps },
            { label: content.iterations.value, value: core.iterations },
          ].map((cell) => (
            <ResultsStatCell
              key={cell.label}
              label={cell.label}
              value={fmtNumber(cell.value, { maximumFractionDigits: 0 })}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getConfidence(
  ci95HalfPct: number,
  content: ResultsPageContent,
): {
  label: string;
  variant: BadgeVariant;
} {
  if (ci95HalfPct <= 0.5) {
    return { label: content.high.value, variant: "default" };
  }

  if (ci95HalfPct <= 1) {
    return { label: content.medium.value, variant: "secondary" };
  }

  if (ci95HalfPct <= 2) {
    return { label: content.low.value, variant: "outline" };
  }

  return { label: content.warming.value, variant: "destructive" };
}
