"use client";

import { WasmBoundary } from "@/components/shared/wasm";
import { useRotation } from "@/lib/query/services";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";

import {
  buildEditorSeed,
  EditorStoreProvider,
  useEditorDocument,
  useEditorUi,
} from "./editor-store-provider";
import { LivePreviewPane } from "./preview/live-preview-pane";
import { RotationEditor } from "./rotation-editor";
import { EditorLayout } from "./shell/editor-layout";
import { EditorToolbar } from "./shell/editor-toolbar";
import { NewRotationPanel } from "./shell/new-rotation-panel";

type RotationEditorPageProps = {
  rotationId?: string;
};

export function RotationEditorPage({
  rotationId,
}: Readonly<RotationEditorPageProps>) {
  const { data: rotation, isLoading: rotationLoading } = useRotation(
    rotationId ?? "",
  );
  const isLoading = rotationId ? rotationLoading : false;

  if (isLoading) {
    return <RotationEditorPageSkeleton />;
  }

  return (
    <EditorStoreProvider
      key={rotationId ?? "new"}
      seed={buildEditorSeed(rotation)}
    >
      <RotationEditorShell rotationId={rotationId} />
    </EditorStoreProvider>
  );
}

function EditorFormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

function NewRotationFormSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 fl-py-4/8">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function RotationEditorPageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

function RotationEditorShell({
  rotationId,
}: Readonly<{ rotationId?: string }>) {
  const isSettingUp = useEditorUi((s) => s.isSettingUp);
  const specId = useEditorDocument((s) => s.metadata.specId) ?? 0;
  const rotationName = useEditorDocument((s) => s.metadata.name);

  if (isSettingUp) {
    return (
      <WasmBoundary fallback={<NewRotationFormSkeleton />}>
        <NewRotationPanel />
      </WasmBoundary>
    );
  }

  return (
    <EditorLayout
      toolbar={
        <EditorToolbar
          rotationId={rotationId}
          rotationName={rotationName}
          specId={specId}
        />
      }
      left={
        <WasmBoundary fallback={<EditorFormSkeleton />}>
          <RotationEditor specId={specId} />
        </WasmBoundary>
      }
      right={
        <WasmBoundary fallback={<Skeleton className="h-full w-full" />}>
          <LivePreviewPane />
        </WasmBoundary>
      }
    />
  );
}
