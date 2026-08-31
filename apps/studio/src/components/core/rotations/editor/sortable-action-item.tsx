"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemoizedFn } from "ahooks";

import { cn } from "@wowlab/shared/lib/utils";

import type { FiringCounts } from "./preview/use-firing-counts";
import type { ActionEntry } from "./types";
import type { ActionIssue } from "./validation/use-action-issues";

import { ActionConditionLabel } from "./action-row/action-condition-label";
import { ActionDragHandle } from "./action-row/action-drag-handle";
import { ActionIssueBadges } from "./action-row/action-issue-badges";
import { ActionRowActions } from "./action-row/action-row-actions";
import { ActionStatusBadges } from "./action-row/action-status-badges";
import { ActionSummary } from "./action-row/action-summary";
import { useEditorDocument, useEditorUi } from "./editor-store-provider";
import { usePreviewQuery } from "./preview/use-preview-query";
import { firingCountKey } from "./preview/utils";

type SortableActionItemProps = {
  action: ActionEntry;
  firingCounts: FiringCounts;
  index: number;
  issues: ActionIssue[];
  listId: string;
  onDelete: () => void;
  onEdit: () => void;
  registerRow: (node: HTMLDivElement | null) => void;
};

export function SortableActionItem({
  action,
  firingCounts,
  index,
  issues,
  listId,
  onDelete,
  onEdit,
  registerRow,
}: Readonly<SortableActionItemProps>) {
  const setSelectionFocus = useEditorUi((s) => s.setSelectionFocus);
  const selectionFocus = useEditorUi((s) => s.selectionFocus);
  const toggleActionEnabled = useEditorDocument((s) => s.toggleActionEnabled);
  const { setQuery: setPreviewQuery } = usePreviewQuery();
  const sortable = useSortable({ id: action.id });
  const isDisabled = action.enabled === false;
  const isFocused =
    selectionFocus?.listId === listId && selectionFocus.actionIndex === index;
  const fires = firingCounts.get(firingCountKey(listId, index)) ?? 0;
  const combinedRef = useMemoizedFn((node: HTMLDivElement | null) => {
    sortable.setNodeRef(node);
    registerRow(node);
  });

  return (
    <div
      ref={combinedRef}
      style={{
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
      }}
      className={cn(
        "flex items-center gap-2 border border-border/50 bg-background px-2 py-1.5",
        sortable.isDragging && "z-10 opacity-60 shadow-lg",
        isDisabled && "opacity-60",
        isFocused &&
          "ring-1 ring-primary shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_18%,transparent)]",
      )}
      onClick={() => setSelectionFocus({ actionIndex: index, listId })}
    >
      <ActionDragHandle
        attributes={sortable.attributes}
        listeners={sortable.listeners}
      />
      <span className="w-6 shrink-0 text-xs text-muted-foreground">
        #{index + 1}
      </span>
      <ActionSummary action={action} />
      <ActionStatusBadges fires={fires} isDisabled={isDisabled} />
      <ActionIssueBadges issues={issues} />
      <ActionConditionLabel condition={action.condition} />
      <ActionRowActions
        isDisabled={isDisabled}
        onDelete={onDelete}
        onDiagnose={() => {
          setSelectionFocus({ actionIndex: index, listId });
          setPreviewQuery({ tab: "diagnose" });
        }}
        onEdit={onEdit}
        onToggle={() => toggleActionEnabled(listId, index)}
      />
    </div>
  );
}
