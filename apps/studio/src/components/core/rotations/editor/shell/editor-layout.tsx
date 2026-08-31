"use client";

import type { ReactNode } from "react";

import { useBoolean, useMemoizedFn } from "ahooks";
import { parseAsInteger, useQueryState } from "nuqs";
import { createContext, use } from "react";

import { NuqsIsland } from "@/components/shared/islands/nuqs-island";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { useIsMobile } from "@wowlab/shared/hooks/use-is-mobile";

import { useEditorHistory, useEditorUi } from "../editor-store-provider";
import { CommandPalette } from "./command-palette";
import { EditorLayoutDesktop } from "./editor-layout-desktop";
import { useEditorLayoutKeyboard } from "./editor-layout-keyboard";
import { EditorLayoutMobile } from "./editor-layout-mobile";

type EditorLayoutProps = {
  left: ReactNode;
  right: ReactNode;
  toolbar: ReactNode;
};
type ToolbarLayoutContextValue = {
  isPreviewVisible: boolean;
  setPreviewVisible: (next: boolean) => void;
};

const ToolbarLayoutContext = createContext<ToolbarLayoutContextValue | null>(
  null,
);

export function EditorLayout(props: Readonly<EditorLayoutProps>) {
  return (
    <NuqsIsland fallback={<EditorLayoutSkeleton />}>
      <Inner {...props} />
    </NuqsIsland>
  );
}

export function useEditorLayoutToolbar(): ToolbarLayoutContextValue {
  return (
    use(ToolbarLayoutContext) ?? {
      isPreviewVisible: true,
      setPreviewVisible: () => {},
    }
  );
}

function EditorLayoutSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

function Inner({ left, right, toolbar }: Readonly<EditorLayoutProps>) {
  const isMobile = useIsMobile();
  const { redo, undo } = useEditorHistory();
  const isDialogOpen = useEditorUi((s) => s.isDialogOpen);
  const closeDialog = useEditorUi((s) => s.closeDialog);
  const [isPaletteOpen, palette] = useBoolean(false);
  const [preview, setPreview] = useQueryState(
    "preview",
    parseAsInteger.withDefault(1),
  );
  const isPreviewVisible = preview !== 0;
  const setPreviewVisible = useMemoizedFn((next: boolean) => {
    void setPreview(next ? 1 : 0, { shallow: true });
  });

  useEditorLayoutKeyboard({
    closeDialog,
    closePalette: palette.setFalse,
    isDialogOpen,
    isPaletteOpen,
    isPreviewVisible,
    redo,
    setPreviewVisible,
    togglePalette: palette.toggle,
    undo,
  });

  return (
    <ToolbarLayoutContext value={{ isPreviewVisible, setPreviewVisible }}>
      {isMobile ? (
        <EditorLayoutMobile left={left} right={right} toolbar={toolbar} />
      ) : (
        <EditorLayoutDesktop
          left={left}
          right={right}
          toolbar={toolbar}
          isPreviewVisible={isPreviewVisible}
        />
      )}
      <CommandPalette isOpen={isPaletteOpen} onOpenChange={palette.set} />
    </ToolbarLayoutContext>
  );
}
