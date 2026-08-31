"use client";

import type { SlotRankingView } from "wowlab-common";

import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { cn } from "@wowlab/shared/lib/utils";

type Row = {
  slot_index: number;
  item_id: number;
  bonus_id_hash: number;
  best_perm_dps: number;
  best_perm_rank: number;
  ci95_half: number;
  win_rate_pct: number;
  marginal_dps_delta: number;
};

type SlotBreakdownProps = {
  slotRankings: SlotRankingView[];
};

export function SlotBreakdown({ slotRankings }: Readonly<SlotBreakdownProps>) {
  const content = useIntlayer("resultsPage");
  const fmtNumber = useNumber();

  const rows: Row[] = slotRankings.flatMap((r) =>
    r.items.map((it) => ({
      best_perm_dps: it.best_perm_dps,
      best_perm_rank: it.best_perm_rank,
      bonus_id_hash: it.bonus_id_hash,
      ci95_half: it.ci95_half,
      item_id: it.item_id,
      marginal_dps_delta: it.marginal_dps_delta,
      slot_index: r.slot_index,
      win_rate_pct: it.win_rate_pct,
    })),
  );

  if (rows.length === 0) {
    return null;
  }

  return (
    <TableCard<Row>
      title={content.tournamentSlotBreakdown.value}
      columns={[
        {
          cell: (row) => <span className="font-mono">#{row.slot_index}</span>,
          header: content.tournamentSlot.value,
        },
        {
          cell: (row) => (
            <span className="font-mono tabular-nums">{row.item_id}</span>
          ),
          header: content.tournamentItem.value,
        },
        {
          cell: (row) => (
            <span className="font-mono tabular-nums">
              {fmtNumber(row.best_perm_dps, { maximumFractionDigits: 0 })}
            </span>
          ),
          className: "text-right",
          header: content.tournamentBestDps.value,
        },
        {
          cell: (row) => {
            const delta = row.marginal_dps_delta;

            return (
              <span
                className={cn(
                  "font-mono tabular-nums",
                  delta < 0 ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {delta >= 0 ? "+" : ""}
                {fmtNumber(delta, { maximumFractionDigits: 0 })}
              </span>
            );
          },
          className: "text-right",
          header: content.tournamentMarginalDelta.value,
        },
        {
          cell: (row) => (
            <Badge variant="outline">{row.win_rate_pct.toFixed(1)}%</Badge>
          ),
          header: content.tournamentWinRate.value,
        },
      ]}
      data={rows}
      rowKey={(row, i) => `${row.slot_index}-${row.item_id}-${i}`}
    />
  );
}
