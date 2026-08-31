"use client";

import { createContext, type ReactNode, use, useState } from "react";
import { useStore } from "zustand";
import { travel } from "zustand-travel";
import { createStore } from "zustand/vanilla";

import type { AnnotationObject } from "../scene/types";

const MAX_HISTORY = 25;

type AnnotationStore = {
  annotations: ReadonlyArray<AnnotationObject>;
  commit: (annotation: AnnotationObject) => void;
  clear: () => void;
};

type AnnotationStoreApi = ReturnType<typeof createAnnotationStore>;

function createAnnotationStore() {
  return createStore<AnnotationStore>()(
    travel(
      (set, get) => ({
        annotations: [],
        clear: () => {
          if (get().annotations.length === 0) {
            return;
          }

          set((s) => {
            s.annotations = [];
          });
        },
        commit: (annotation) =>
          set((s) => {
            s.annotations = [...s.annotations, annotation];
          }),
      }),
      { maxHistory: MAX_HISTORY },
    ),
  );
}

const PlannerStoreContext = createContext<AnnotationStoreApi | null>(null);

export function PlannerStoreProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [store] = useState(createAnnotationStore);

  return <PlannerStoreContext value={store}>{children}</PlannerStoreContext>;
}

export function usePlannerAnnotations(): ReadonlyArray<AnnotationObject> {
  return useStore(usePlannerStore(), (s) => s.annotations);
}

export function usePlannerCanClear(): boolean {
  return useStore(usePlannerStore(), (s) => s.annotations.length > 0);
}

export function usePlannerClear() {
  return useStore(usePlannerStore(), (s) => s.clear);
}

export function usePlannerCommit() {
  return useStore(usePlannerStore(), (s) => s.commit);
}

export function usePlannerHistory() {
  const store = usePlannerStore();
  // Subscribe to `position` so canUndo/canRedo re-render on every history transition.
  const position = useStore(store, () => store.getControls!().position);
  const controls = store.getControls!();

  return {
    canRedo: controls.canForward(),
    canUndo: controls.canBack(),
    position,
    redo: () => controls.forward(),
    undo: () => controls.back(),
  };
}

function usePlannerStore(): AnnotationStoreApi {
  const store = use(PlannerStoreContext);

  if (!store) {
    throw new Error("Planner hooks must be used within a PlannerStoreProvider");
  }

  return store;
}
