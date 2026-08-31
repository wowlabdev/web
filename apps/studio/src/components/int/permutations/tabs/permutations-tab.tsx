"use client";

import type { PermutationSpace } from "wowlab-common";

import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import { useSlotLabels } from "@/components/core/simulate/use-slot-labels";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@wowlab/shared/components/ui/toggle-group";

import type { FormatNumber } from "../shared";

import { contestedSlots } from "../types";

const PRESET_COUNTS = [10, 50, 100, 500] as const;

export type PermutationsTabProps = {
  fmtNumber: FormatNumber;
  onShowCountChange: (n: number) => void;
  permutations: number[][];
  showCount: number;
  space: PermutationSpace;
};

type PermutationRow = {
  index: number;
  itemIds: number[];
};

export function PermutationsTab({
  fmtNumber,
  onShowCountChange,
  permutations,
  showCount,
  space,
}: Readonly<PermutationsTabProps>) {
  const content = useIntlayer("permutationsPage");
  const slotLabels = useSlotLabels();
  const contested = useMemo(() => contestedSlots(space), [space]);
  const data: PermutationRow[] = permutations.map((perm, index) => ({
    index,
    itemIds: perm,
  }));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          {content.permutationsTab.showing({
            shown: Math.min(showCount, Number(space.total)),
            total: fmtNumber(space.total),
          })}
        </span>
        <ToggleGroup
          className="flex gap-1"
          onValueChange={(value) => {
            if (value) {
              onShowCountChange(Number(value));
            }
          }}
          type="single"
          value={String(showCount)}
          variant="outline"
        >
          {PRESET_COUNTS.map((n) => (
            <ToggleGroupItem key={n} value={String(n)}>
              {n}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <TableCard<PermutationRow>
        title={content.permutationsTab.title}
        data={data}
        rowKey={(row) => row.index}
        columns={[
          {
            cell: (row) => (
              <span className="font-mono tabular-nums text-muted-foreground">
                {row.index}
              </span>
            ),
            header: content.permutationsTab.headerIndex.value,
          },
          ...contested.map((slot, slotIndex) => ({
            cell: (row: PermutationRow) => (
              <span className="font-mono tabular-nums">
                {row.itemIds[slotIndex]}
              </span>
            ),
            header: slotLabels[slot.slot],
          })),
        ]}
      />
    </div>
  );
}
