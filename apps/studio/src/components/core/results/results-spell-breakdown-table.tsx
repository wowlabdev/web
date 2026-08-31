"use client";

import type { ActionView, AnalyticsView } from "wowlab-common";

import { useCreation } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wowlab/shared/components/ui/table";

type ResultsSpellBreakdownTableProps = {
  actions: ActionView[];
  analytics: AnalyticsView;
};

export function ResultsSpellBreakdownTable({
  actions,
  analytics,
}: Readonly<ResultsSpellBreakdownTableProps>) {
  const content = useIntlayer("resultsPage");
  const fmtNumber = useNumber();
  const fightTimeSec = analytics.core.total_fight_time_ms / 1000;
  const sorted = useCreation(
    () => [...actions].sort((a, b) => b.total_damage - a.total_damage),
    [actions],
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{content.spellBreakdown}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="text-muted-foreground">
              <TableHead className="pr-4">{content.spellId}</TableHead>
              <TableHead className="pr-4 text-right">
                {content.damage}
              </TableHead>
              <TableHead className="pr-4 text-right">{content.dps}</TableHead>
              <TableHead className="pr-4 text-right">{content.casts}</TableHead>
              <TableHead className="text-right">
                {content.critPercent}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((action) => {
              const totalHits = action.direct_hits + action.ticks;
              const critPct =
                totalHits > 0
                  ? ((action.crits / totalHits) * 100).toFixed(1)
                  : "0.0";
              const dps =
                fightTimeSec > 0
                  ? Math.round(action.total_damage / fightTimeSec)
                  : 0;

              return (
                <TableRow key={action.spell_id} className="last:border-0">
                  <TableCell className="pr-4 font-mono">
                    {action.spell_id}
                  </TableCell>
                  <TableCell className="pr-4 text-right font-mono tabular-nums">
                    {fmtNumber(action.total_damage, {
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell className="pr-4 text-right font-mono tabular-nums">
                    {fmtNumber(dps, { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell className="pr-4 text-right font-mono tabular-nums">
                    {fmtNumber(action.casts, { maximumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {critPct}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
