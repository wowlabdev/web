"use client";

import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";

import type { JobRow } from "@/lib/query/services/jobs";

import { getJobMeta } from "@/lib/query/services/jobs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

import { ResultsStatCell } from "./results-stat-cell";

type ResultsJobDetailsCardProps = {
  job: JobRow;
};

export function ResultsJobDetailsCard({
  job,
}: Readonly<ResultsJobDetailsCardProps>) {
  const content = useIntlayer("resultsPage");
  const fmtDate = useDate();
  const meta = getJobMeta(job);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.jobDetails}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <ResultsStatCell label={content.status.value} value={meta.status} />
          <ResultsStatCell
            label={content.created.value}
            value={fmtDate(new Date(meta.created_at), {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
