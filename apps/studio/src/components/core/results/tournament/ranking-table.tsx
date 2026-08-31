"use client";

import type { PermutationSummaryView } from "wowlab-common";

import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import { useMemo } from "react";

import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { cn } from "@wowlab/shared/lib/utils";

type RankingTableProps = {
  permutations: PermutationSummaryView[];
};

export function RankingTable({ permutations }: Readonly<RankingTableProps>) {
  const content = useIntlayer("resultsPage");
  const fmtNumber = useNumber();
  const rounded = (value: number) =>
    fmtNumber(value, { maximumFractionDigits: 0 });

  const sorted = useMemo(
    () => [...permutations].sort((a, b) => b.mean_dps - a.mean_dps),
    [permutations],
  );

  return (
    <TableCard<PermutationSummaryView>
      title={content.tournamentRanking.value}
      columns={[
        {
          cell: (row) => <span className="font-mono">#{row.rank + 1}</span>,
          header: content.tournamentRank.value,
        },
        {
          cell: (row) => (
            <span className="font-mono tabular-nums">
              {rounded(row.mean_dps)}
            </span>
          ),
          className: "text-right",
          header: content.dps.value,
        },
        {
          cell: (row) => {
            const delta = row.dps_delta_from_winner;

            return (
              <span
                className={cn(
                  "font-mono tabular-nums",
                  delta < 0 ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {delta >= 0 ? "+" : ""}
                {rounded(delta)}
              </span>
            );
          },
          className: "text-right",
          header: content.tournamentDelta.value,
        },
        {
          cell: (row) => (
            <span className="font-mono tabular-nums text-muted-foreground">
              {"\u00B1"}
              {rounded(row.ci95_half)}
            </span>
          ),
          className: "text-right",
          header: content.tournamentStderr.value,
        },
        {
          cell: (row) =>
            row.diffs.length === 0 ? (
              <Badge variant="outline">
                {content.tournamentBaseline.value}
              </Badge>
            ) : (
              <span className="font-mono text-xs text-muted-foreground">
                {row.diffs.length}
              </span>
            ),
          header: content.tournamentSlotChanges.value,
        },
      ]}
      data={sorted}
      rowKey={(row) => row.rank}
    />
  );
}
