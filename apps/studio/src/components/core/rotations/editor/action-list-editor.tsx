"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useEffect, useRef } from "react";

import { Button } from "@wowlab/shared/components/ui/button";

import type { ActionEntry } from "./types";
import type { ActionIssuesIndex } from "./validation/use-action-issues";

import { useEditorUi } from "./editor-store-provider";
import { applyPulseAnimation } from "./lib/animation";
import { useFiringCounts } from "./preview/use-firing-counts";
import { SortableActionItem } from "./sortable-action-item";
import { issuesForAction } from "./validation/utils";

type ActionListEditorProps = {
  actions: ActionEntry[];
  issues: ActionIssuesIndex;
  listId: string;
  onChange: (actions: ActionEntry[]) => void;
  onEditAction: (action: ActionEntry) => void;
  onAddAction: () => void;
};

export function ActionListEditor({
  actions,
  issues,
  listId,
  onAddAction,
  onChange,
  onEditAction,
}: Readonly<ActionListEditorProps>) {
  const content = useIntlayer("rotationEditor");
  const firingCounts = useFiringCounts();
  const selectionFocus = useEditorUi((s) => s.selectionFocus);
  const rowsRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (!selectionFocus || selectionFocus.listId !== listId) {
      return;
    }

    const node = rowsRef.current.get(selectionFocus.actionIndex);

    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "nearest" });

      return applyPulseAnimation(node);
    }
  }, [selectionFocus, listId]);

  const registerRow = (index: number, node: HTMLDivElement | null) => {
    if (node) {
      rowsRef.current.set(index, node);
    } else {
      rowsRef.current.delete(index);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIdx = actions.findIndex((a) => a.id === active.id);
    const newIdx = actions.findIndex((a) => a.id === over.id);

    if (oldIdx === -1 || newIdx === -1) {
      return;
    }

    onChange(arrayMove(actions, oldIdx, newIdx));
  };

  return (
    <div className="space-y-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={actions.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {actions.map((action, idx) => (
            <SortableActionItem
              key={action.id}
              action={action}
              firingCounts={firingCounts}
              index={idx}
              issues={issuesForAction(issues, listId, idx)}
              listId={listId}
              onEdit={() => onEditAction(action)}
              onDelete={() =>
                onChange(actions.filter((a) => a.id !== action.id))
              }
              registerRow={(node) => registerRow(idx, node)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        variant="outline"
        size="sm"
        className="mt-2 h-7 text-xs"
        onClick={onAddAction}
      >
        <PlusIcon className="size-3" />
        {content.addActionButton}
      </Button>
    </div>
  );
}
