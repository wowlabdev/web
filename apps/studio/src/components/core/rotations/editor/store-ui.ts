"use client";

import { createStore } from "zustand/vanilla";

import { type DocumentStoreApi } from "./store-document";
import { type UiStore } from "./store-types";
import { INITIAL_VALIDATION_STATE } from "./validation/types";

export type UiStoreApi = ReturnType<typeof createUiStore>;

export function createUiStore(document: DocumentStoreApi, isNew: boolean) {
  return createStore<UiStore>()((set, get) => ({
    closeDialog: () => set({ isDialogOpen: false }),
    confirmNewDraft: () => {
      document.getState().rebaseHistory();
      set({ isSettingUp: false });
    },
    editingAction: null,
    editingList: "",
    exitSetup: () => {
      if (get().isSettingUp) {
        set({ isSettingUp: false });
      }
    },
    isDialogOpen: false,

    isSettingUp: isNew,
    openAddAction: (listName) =>
      set({ editingAction: null, editingList: listName, isDialogOpen: true }),
    openEditAction: (listName, action) =>
      set({ editingAction: action, editingList: listName, isDialogOpen: true }),
    requestNewDraft: () => {
      document.getState().resetToEmptyDraft();
      set({
        isSettingUp: true,
        selectionFocus: null,
        trace: null,
        validation: INITIAL_VALIDATION_STATE,
      });
    },
    selectionFocus: null,
    setDraftSpec: (specId) => {
      document.getState().loadDraftForSpec(specId);
      set({ selectionFocus: null, trace: null });
    },

    setSelectionFocus: (focus) => set({ selectionFocus: focus }),
    setTrace: (trace) => set({ trace }),
    setValidation: (validation) => set({ validation }),
    trace: null,
    validation: INITIAL_VALIDATION_STATE,
  }));
}
