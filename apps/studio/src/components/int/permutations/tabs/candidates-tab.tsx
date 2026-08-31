"use client";

import type { GearSlot, PermutationSpace } from "wowlab-common";

import { useIntlayer } from "next-intlayer";

import { useSlotLabels } from "@/components/core/simulate/use-slot-labels";
import { GameItem } from "@/components/shared/game";
import { TableCard } from "@wowlab/shared/components/common/table-card";

import { slotItemIds } from "../types";

type CandidatesRow = {
  slot: GearSlot;
  count: number;
  equipped: number;
  bag: number;
  weekly: number;
  itemIds: number[];
  isContested: boolean;
};

export function CandidatesTab({
  space,
}: Readonly<{ space: PermutationSpace }>) {
  const content = useIntlayer("permutationsPage");
  const slotLabels = useSlotLabels();
  const rows: CandidatesRow[] = space.slots.map((sc) => ({
    bag: sc.candidates.filter((c) => c.source === "bag").length,
    count: sc.candidates.length,
    equipped: sc.candidates.filter((c) => c.source === "equipped").length,
    isContested: sc.candidates.length > 1,
    itemIds: slotItemIds(sc),
    slot: sc.slot,
    weekly: sc.candidates.filter((c) => c.source === "weekly").length,
  }));

  return (
    <TableCard<CandidatesRow>
      title={content.candidatesTab.title}
      data={rows}
      rowKey={(row) => row.slot}
      columns={[
        {
          cell: (row) => (
            <span
              className={
                row.isContested ? "font-semibold" : "text-muted-foreground"
              }
            >
              {slotLabels[row.slot]}
              {row.isContested ? "" : " ·"}
            </span>
          ),
          header: content.candidatesTab.headerSlot.value,
        },
        {
          cell: (row) => (
            <span className="font-mono tabular-nums">{row.count}</span>
          ),
          className: "text-right",
          header: content.candidatesTab.headerCount.value,
        },
        {
          cell: (row) => (
            <span className="font-mono tabular-nums text-muted-foreground">
              {row.equipped}/{row.bag}/{row.weekly}
            </span>
          ),
          className: "text-right",
          header: content.candidatesTab.headerSources.value,
        },
        {
          cell: (row) => (
            <div className="flex flex-wrap gap-1">
              {row.itemIds.map((id) => (
                <GameItem key={`${row.slot}-${id}`} id={id} />
              ))}
            </div>
          ),
          header: content.candidatesTab.headerItems.value,
        },
      ]}
    />
  );
}
