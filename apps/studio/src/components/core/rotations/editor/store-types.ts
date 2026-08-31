import type { IterationTrace } from "wowlab-engine";

import type { ActionEntry, Condition, Rotation } from "./types";
import type { RotationValidationState } from "./validation/types";

// History is owned by the `zustand-travel` middleware, not by fields here.
export type DocumentStore = {
  script: EditorScript;
  metadata: RotationMetadata;
  addList: (name: string) => void;
  removeList: (name: string) => void;
  updateList: (name: string, actions: ActionEntry[]) => void;
  saveAction: (listName: string, action: ActionEntry) => void;
  toggleActionEnabled: (listId: string, actionIndex: number) => void;
  replaceScript: (rotation: Rotation) => void;
  dehydrate: () => Rotation;
  updateMetadataDraft: (patch: Partial<RotationMetadata>) => void;
  commitMetadata: () => void;
  resetToLoaded: () => void;
  loadDraftForSpec: (specId: number) => void;
  resetToEmptyDraft: () => void;
  rebaseHistory: () => void;
};
// docref:start state-mgmt-editor-script
export type EditorScript = {
  version: number;
  name: string;
  variables: Record<string, Condition>;
  actions: ActionEntry[];
  lists: Record<string, ActionEntry[]>;
};
// docref:end state-mgmt-editor-script

export type EditorSeed = {
  script: EditorScript;
  metadata: RotationMetadata;
  isNew: boolean;
};

export type RotationMetadata = {
  rotationId: string | null;
  ownerId: string | null;
  forkedFromId: string | null;
  specId: number | null;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  isPublic: boolean;
};

export type SelectionFocus = { listId: string; actionIndex: number };

export type UiStore = {
  isDialogOpen: boolean;
  editingAction: ActionEntry | null;
  editingList: string;
  openAddAction: (listName: string) => void;
  openEditAction: (listName: string, action: ActionEntry) => void;
  closeDialog: () => void;

  selectionFocus: null | SelectionFocus;
  setSelectionFocus: (focus: null | SelectionFocus) => void;
  trace: IterationTrace | null;
  setTrace: (trace: IterationTrace | null) => void;
  validation: RotationValidationState;
  setValidation: (validation: RotationValidationState) => void;

  isSettingUp: boolean;
  requestNewDraft: () => void;
  setDraftSpec: (specId: number) => void;
  confirmNewDraft: () => void;
  exitSetup: () => void;
};
