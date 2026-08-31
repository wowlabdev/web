"use client";

import type { CostAnalysis, PermutationSpace } from "wowlab-common";

import { LayersIcon, SigmaIcon, ZapIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { StatCard } from "@wowlab/shared/components/common/stat-card";
import { TableCard } from "@wowlab/shared/components/common/table-card";

import type { FormatNumber } from "../shared";

import { createFormatters } from "../shared";
import { WhatIfPanel } from "./what-if-panel";

export type CostTabProps = {
  costs: CostAnalysis;
  fmtNumber: FormatNumber;
  space: PermutationSpace;
};
type CostScreeningRow = {
  keepPct: number;
  survivors: number;
  tournamentCost: number;
  totalCost: number;
  savingsPct: number;
};

export function CostTab({ costs, fmtNumber, space }: Readonly<CostTabProps>) {
  const content = useIntlayer("permutationsPage");
  const { compact, integer } = createFormatters(fmtNumber);
  const stats = [
    {
      change: content.costTab.factorialChange({
        count: costs.pairCount,
        main: compact(costs.mainEffectIters),
        pairs: costs.pairCount,
      }).value,
      icon: <SigmaIcon className="size-4" />,
      key: "factorial",
      title: content.costTab.factorialTitle.value,
      value: compact(costs.factorialTotal),
    },
    {
      change: content.costTab.bruteForceChange({ total: integer(space.total) })
        .value,
      icon: <ZapIcon className="size-4" />,
      key: "bruteForce",
      title: content.costTab.bruteForceTitle.value,
      value: compact(costs.bruteForce),
    },
    {
      change: content.costTab.pairwiseChange({
        count: costs.pairCount,
        pairs: costs.pairCount,
      }).value,
      icon: <LayersIcon className="size-4" />,
      key: "pairwise",
      title: content.costTab.pairwiseTitle.value,
      value: compact(costs.pairIters),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            changePercentage={stat.change}
          />
        ))}
      </div>

      <TableCard<CostScreeningRow>
        title={content.costTab.screeningTitle}
        data={costs.screening as CostScreeningRow[]}
        rowKey={(row) => row.keepPct}
        columns={[
          {
            cell: (row) => (
              <span className="font-mono tabular-nums">{row.keepPct}%</span>
            ),
            header: content.costTab.headerKeepPct.value,
          },
          {
            cell: (row) => (
              <span className="font-mono tabular-nums">
                {integer(row.survivors)}
              </span>
            ),
            className: "text-right",
            header: content.costTab.headerSurvivors.value,
          },
          {
            cell: (row) => (
              <span className="font-mono tabular-nums">
                {compact(row.tournamentCost)}
              </span>
            ),
            className: "text-right",
            header: content.costTab.headerTournament.value,
          },
          {
            cell: (row) => (
              <span className="font-mono tabular-nums font-semibold">
                {compact(row.totalCost)}
              </span>
            ),
            className: "text-right",
            header: content.costTab.headerTotal.value,
          },
          {
            cell: (row) => (
              <span className="font-mono tabular-nums text-muted-foreground">
                {row.savingsPct.toFixed(1)}%
              </span>
            ),
            className: "text-right",
            header: content.costTab.headerSavings.value,
          },
        ]}
      />

      <WhatIfPanel base={Number(space.total)} fmtNumber={fmtNumber} />
    </div>
  );
}
