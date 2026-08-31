"use client";

import type { GearSlot, Item } from "wowlab-common";

import { useIntlayer } from "next-intlayer";

import { useSlotLabels } from "@/components/core/simulate/use-slot-labels";
import { GameItem } from "@/components/shared/game";
import { TableCard } from "@wowlab/shared/components/common/table-card";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Checkbox } from "@wowlab/shared/components/ui/checkbox";

export type InventoryRow = {
  index: number;
  isSelected: boolean;
  item: Item;
  source: "bag" | "weekly";
};

type InventorySlotTableProps = {
  items: InventoryRow[];
  onToggleItem: (slot: string, index: number) => void;
  slot: GearSlot;
};

export function InventorySlotTable({
  items,
  onToggleItem,
  slot,
}: Readonly<InventorySlotTableProps>) {
  const content = useIntlayer("simulateShared");
  const slotLabels = useSlotLabels();

  return (
    <TableCard
      title={slotLabels[slot]}
      columns={[
        {
          cell: (row: InventoryRow) => (
            <Checkbox
              checked={row.isSelected}
              onCheckedChange={() => onToggleItem(slot, row.index)}
            />
          ),
          className: "w-10",
          header: "",
        },
        {
          cell: (row: InventoryRow) => <GameItem id={row.item.id} />,
          header: content.headerItem.value,
        },
        {
          cell: (row: InventoryRow) => (
            <Badge variant={row.source === "weekly" ? "secondary" : "outline"}>
              {row.source === "weekly" ? content.weeklyBadge : content.bagBadge}
            </Badge>
          ),
          header: content.headerSource.value,
        },
      ]}
      data={items}
      rowKey={(row: InventoryRow, i: number) => `${slot}-${row.item.id}-${i}`}
    />
  );
}
