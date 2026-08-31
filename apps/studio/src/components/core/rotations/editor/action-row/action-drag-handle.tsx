"use client";

import type { useSortable } from "@dnd-kit/sortable";

import { GripVerticalIcon } from "lucide-react";

type ActionDragHandleProps = {
  attributes: Sortable["attributes"];
  listeners: Sortable["listeners"];
};

type Sortable = ReturnType<typeof useSortable>;

export function ActionDragHandle({
  attributes,
  listeners,
}: Readonly<ActionDragHandleProps>) {
  return (
    <button
      type="button"
      className="shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <GripVerticalIcon className="size-4" />
    </button>
  );
}
