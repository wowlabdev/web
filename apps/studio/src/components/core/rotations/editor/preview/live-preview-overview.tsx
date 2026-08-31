"use client";

import type { IterationTrace } from "wowlab-engine";

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
import { useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { Button } from "@wowlab/shared/components/ui/button";

import type { LiveTraceState, PreviewControls } from "./use-live-trace";
import type { PreviewQuery } from "./use-preview-query";
import type { usePreviewSections } from "./use-preview-sections";

import { DEFAULT_PREVIEW_ORDER } from "./constants";
import { CopyDiagnosticsButton } from "./copy-diagnostics-button";
import { PaneSkeleton } from "./pane-skeleton";
import { PreviewBar } from "./preview-bar";
import { PreviewSection } from "./preview-section";
import { RunSummaryCard } from "./run-summary-card";
import { TraceAgeChip } from "./trace-age-chip";

type LivePreviewOverviewProps = {
  controls: PreviewControls;
  error: null | string;
  getDiagnostics: () => string;
  lastRunAt: null | number;
  onControlsChange: (controls: PreviewControls) => void;
  previewSections: ReturnType<typeof usePreviewSections>;
  query: PreviewQuery;
  retry: () => void;
  runState: LiveTraceState;
  setQuery: (updates: Partial<PreviewQuery>) => void;
  trace: IterationTrace | null;
};

export function LivePreviewOverview({
  controls,
  error,
  getDiagnostics,
  lastRunAt,
  onControlsChange,
  previewSections,
  query,
  retry,
  runState,
  setQuery,
  trace,
}: Readonly<LivePreviewOverviewProps>) {
  const content = useIntlayer("rotationEditor");
  const sectionOrder = useMemo(() => {
    const missing = DEFAULT_PREVIEW_ORDER.filter(
      (id) => !query.order.includes(id),
    );

    return missing.length > 0 ? [...query.order, ...missing] : query.order;
  }, [query.order]);
  const collapsedSections = useMemo(
    () => new Set(query.collapsed),
    [query.collapsed],
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const handleDragEnd = useMemoizedFn((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const previousIndex = sectionOrder.indexOf(String(active.id));
    const nextIndex = sectionOrder.indexOf(String(over.id));

    if (previousIndex === -1 || nextIndex === -1) {
      return;
    }

    setQuery({ order: arrayMove(sectionOrder, previousIndex, nextIndex) });
  });

  if (runState === "error") {
    return (
      <Alert variant="destructive">
        <AlertTitle>{content.previewErrorTitle}</AlertTitle>
        <AlertDescription className="space-y-2">
          <p className="text-xs">{error}</p>
          <Button onClick={retry} size="sm" variant="outline">
            {content.previewRetryButton}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (runState === "pending") {
    return <PaneSkeleton />;
  }

  return (
    <>
      <RunSummaryCard trace={trace} />
      {trace ? (
        <>
          <PreviewBar
            onChange={onControlsChange}
            rightSlot={
              <>
                <TraceAgeChip at={lastRunAt} />
                <CopyDiagnosticsButton getValue={getDiagnostics} />
              </>
            }
            value={controls}
          />
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext
              items={sectionOrder}
              strategy={verticalListSortingStrategy}
            >
              {sectionOrder.map((id) => {
                if (!Object.hasOwn(previewSections, id)) {
                  return null;
                }

                const section = previewSections[id];

                return (
                  <PreviewSection
                    description={section.description}
                    id={id}
                    isCollapsed={collapsedSections.has(id)}
                    key={id}
                    onCollapseChange={(isCollapsed) =>
                      setQuery({
                        collapsed: isCollapsed
                          ? [...query.collapsed, id]
                          : query.collapsed.filter((entry) => entry !== id),
                      })
                    }
                    title={section.title}
                  >
                    {section.node}
                  </PreviewSection>
                );
              })}
            </SortableContext>
          </DndContext>
        </>
      ) : null}
    </>
  );
}
