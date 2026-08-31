"use client";

import { createContext, type ReactNode, use, useState } from "react";
import { useStore } from "zustand";

import type { Row } from "@wowlab/shared/lib/supabase/types";

import { parseStoredRotation } from "../rotation-schema";
import { createEmptyRotation } from "./lib/empty-rotation";
import { createDocumentStore, type DocumentStoreApi } from "./store-document";
import { EMPTY_METADATA, hydrate } from "./store-helpers";
import { buildInitMetadata } from "./store-reducers";
import {
  type DocumentStore,
  type EditorSeed,
  type UiStore,
} from "./store-types";
import { createUiStore, type UiStoreApi } from "./store-ui";

type EditorStores = {
  document: DocumentStoreApi;
  ui: UiStoreApi;
};

const EditorStoreContext = createContext<EditorStores | null>(null);

export function buildEditorSeed(
  rotation: Row<"rotations"> | undefined,
): EditorSeed {
  if (!rotation) {
    return {
      isNew: true,
      metadata: { ...EMPTY_METADATA, tags: [] },
      script: hydrate(createEmptyRotation()),
    };
  }

  const script = parseStoredRotation(rotation.script);

  return {
    isNew: false,
    metadata: buildInitMetadata(script, {
      description: rotation.description ?? "",
      forkedFromId: rotation.forked_from_id,
      isPublic: rotation.is_public,
      name: rotation.name,
      ownerId: rotation.user_id,
      rotationId: rotation.id,
      slug: rotation.slug,
      specId: rotation.spec_id,
      tags: [],
    }),
    script: hydrate(script),
  };
}

export function EditorStoreProvider({
  children,
  seed,
}: Readonly<{ children: ReactNode; seed: EditorSeed }>) {
  const [stores] = useState<EditorStores>(() => {
    const document = createDocumentStore(seed);

    return { document, ui: createUiStore(document, seed.isNew) };
  });

  return <EditorStoreContext value={stores}>{children}</EditorStoreContext>;
}

export function useEditorDocument<T>(selector: (state: DocumentStore) => T): T {
  return useStore(useEditorStores().document, selector);
}

export function useEditorHistory() {
  const { document } = useEditorStores();
  // Subscribe to `position` so canUndo/canRedo re-render on every history transition.
  const position = useStore(document, () => document.getControls!().position);
  const controls = document.getControls!();

  return {
    canRedo: controls.canForward(),
    canUndo: controls.canBack(),
    position,
    redo: () => controls.forward(),
    undo: () => controls.back(),
  };
}

export function useEditorUi<T>(selector: (state: UiStore) => T): T {
  return useStore(useEditorStores().ui, selector);
}

function useEditorStores(): EditorStores {
  const stores = use(EditorStoreContext);

  if (!stores) {
    throw new Error(
      "Editor store hooks must be used within an EditorStoreProvider",
    );
  }

  return stores;
}
