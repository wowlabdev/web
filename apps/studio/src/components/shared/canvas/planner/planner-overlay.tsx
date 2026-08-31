"use client";

import { type RefObject, useId, useMemo } from "react";

import { TooltipProvider } from "@wowlab/shared/components/ui/tooltip";
import { cn } from "@wowlab/shared/lib/utils";

import type { CanvasHandle } from "../konva/konva-canvas";
import type { AnnotationObject } from "../scene/types";

import { HintBanner } from "./hint-banner";
import {
  usePlannerCanClear,
  usePlannerClear,
  usePlannerCommit,
  usePlannerHistory,
} from "./planner-store-provider";
import { TextEntryPopover } from "./text-entry-popover";
import { Toolbar } from "./toolbar";
import { useAnnotationDrawing } from "./use-annotation-drawing";
import { useAnnotationTool } from "./use-annotation-tool";
import { useCanvasExport } from "./use-canvas-export";

export type PlannerOverlayProps = {
  canvasRef: RefObject<CanvasHandle | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  onPreviewChange?: (preview: AnnotationObject | null) => void;
  annotationLayerId: string;
  exportFileName: string;
  className?: string;
};

export function PlannerOverlay({
  annotationLayerId,
  canvasRef,
  className,
  containerRef,
  exportFileName,
  onPreviewChange,
}: Readonly<PlannerOverlayProps>) {
  const textInputId = useId();

  const { color, setColor, setTool, tool } = useAnnotationTool();
  const commit = usePlannerCommit();
  const clear = usePlannerClear();
  const canClear = usePlannerCanClear();
  const { canRedo, canUndo, redo, undo } = usePlannerHistory();
  const {
    handleDoubleClick,
    handlePointerDown,
    hint,
    isDrawing,
    mode,
    setMode,
    submitText,
  } = useAnnotationDrawing({
    annotationLayerId,
    canvasRef,
    color,
    commit,
    containerRef,
    onPreviewChange,
    tool,
  });
  const { exportPng } = useCanvasExport({
    canvasRef,
    fileName: exportFileName,
  });

  const captureLayerStyle = useMemo(
    () =>
      ({
        cursor: isDrawing ? "crosshair" : "auto",
        pointerEvents: isDrawing ? "auto" : "none",
      }) as const,
    [isDrawing],
  );

  const handleSelectTool = (next: typeof tool) => {
    setTool(next);

    if (next === "select") {
      setMode({ kind: "idle" });
    }
  };

  return (
    <TooltipProvider>
      <div className={cn("pointer-events-none absolute inset-0", className)}>
        <div
          className="absolute inset-0"
          style={captureLayerStyle}
          onPointerDown={handlePointerDown}
          onDoubleClick={handleDoubleClick}
          data-tool={tool}
          data-mode={mode.kind}
        />

        {hint ? <HintBanner hint={hint} /> : null}

        <Toolbar
          tool={tool}
          color={color}
          canUndo={canUndo}
          canRedo={canRedo}
          canClear={canClear}
          onSelectTool={handleSelectTool}
          onColorChange={setColor}
          onUndo={undo}
          onRedo={redo}
          onClear={clear}
          onExport={exportPng}
        />

        {mode.kind === "text" ? (
          <TextEntryPopover
            inputId={textInputId}
            mode={mode}
            onChange={(value) => setMode({ ...mode, value })}
            onSubmit={submitText}
            onCancel={() => setMode({ kind: "idle" })}
          />
        ) : null}
      </div>
    </TooltipProvider>
  );
}
