"use client";

import { useKeyPress } from "ahooks";

type UseEditorLayoutKeyboardArgs = {
  closeDialog: () => void;
  closePalette: () => void;
  isDialogOpen: boolean;
  isPaletteOpen: boolean;
  isPreviewVisible: boolean;
  redo: () => void;
  setPreviewVisible: (next: boolean) => void;
  togglePalette: () => void;
  undo: () => void;
};

export function useEditorLayoutKeyboard({
  closeDialog,
  closePalette,
  isDialogOpen,
  isPaletteOpen,
  isPreviewVisible,
  redo,
  setPreviewVisible,
  togglePalette,
  undo,
}: UseEditorLayoutKeyboardArgs): void {
  useKeyPress(
    ["meta.z", "ctrl.z"],
    (event) => {
      if (event.shiftKey) {
        return;
      }

      event.preventDefault();
      undo();
    },
    { exactMatch: false },
  );
  useKeyPress(
    ["shift.meta.z", "shift.ctrl.z"],
    (event) => {
      event.preventDefault();
      redo();
    },
    { exactMatch: false },
  );
  useKeyPress(
    ["meta.p", "ctrl.p"],
    (event) => {
      event.preventDefault();
      setPreviewVisible(!isPreviewVisible);
    },
    { exactMatch: false },
  );
  useKeyPress(
    ["meta.forwardslash", "ctrl.forwardslash"],
    (event) => {
      event.preventDefault();
      togglePalette();
    },
    { exactMatch: false },
  );
  useKeyPress(["esc"], () => {
    if (isPaletteOpen) {
      closePalette();

      return;
    }

    if (isDialogOpen) {
      closeDialog();
    }
  });
}
