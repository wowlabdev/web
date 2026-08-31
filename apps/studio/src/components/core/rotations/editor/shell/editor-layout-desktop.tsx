"use client";

import type { ReactNode } from "react";

import { parseAsInteger, useQueryState } from "nuqs";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@wowlab/shared/components/ui/resizable";

type EditorLayoutDesktopProps = {
  left: ReactNode;
  isPreviewVisible: boolean;
  right: ReactNode;
  toolbar: ReactNode;
};

export function EditorLayoutDesktop({
  isPreviewVisible,
  left,
  right,
  toolbar,
}: Readonly<EditorLayoutDesktopProps>) {
  const [split, setSplit] = useQueryState(
    "split",
    parseAsInteger.withDefault(60),
  );

  const leftSize = isPreviewVisible ? clampSplit(split) : 100;

  return (
    <div className="flex min-h-[calc(100dvh-10rem)] flex-col gap-4">
      {toolbar}
      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-[400px] flex-1 rounded-lg border"
        onLayoutChanged={(layout) => {
          if (!isPreviewVisible) {
            return;
          }

          if (
            !Object.hasOwn(layout, "editor-left") ||
            !Object.hasOwn(layout, "editor-right")
          ) {
            return;
          }

          const leftFlex = layout["editor-left"];
          const rightFlex = layout["editor-right"];
          const total = leftFlex + rightFlex;

          if (total <= 0) {
            return;
          }

          void setSplit(Math.round((leftFlex / total) * 100), {
            shallow: true,
          });
        }}
      >
        <ResizablePanel id="editor-left" defaultSize={leftSize} minSize={30}>
          <div className="h-full min-w-0 overflow-auto p-4">{left}</div>
        </ResizablePanel>
        {isPreviewVisible && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel
              id="editor-right"
              defaultSize={100 - leftSize}
              minSize={20}
            >
              <div className="h-full min-w-0 overflow-auto p-4">{right}</div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}

function clampSplit(value: number): number {
  if (!Number.isFinite(value)) {
    return 60;
  }

  if (value < 30) {
    return 30;
  }

  if (value > 80) {
    return 80;
  }

  return value;
}
