"use client";

import { SparklesIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { parseAsString, useQueryState } from "nuqs";

import { Button } from "@wowlab/shared/components/ui/button";

import { ActionEditDialog } from "./action-edit-dialog";
import { ActionListEditor } from "./action-list-editor";
import { ActionListsSidebar } from "./action-lists-sidebar";
import { AssistantPanel, useAssistantStore } from "./assistant";
import { useEditorDocument, useEditorUi } from "./editor-store-provider";
import { type Rotation } from "./types";
import { useEditorContext } from "./use-editor-context";
import { useActionIssues } from "./validation/use-action-issues";
import { useRotationValidation } from "./validation/use-rotation-validation";
import { ValidationStrip } from "./validation/validation-strip";
type RotationEditorProps = {
  specId: number;
  onSave?: (script: Rotation) => void;
};

export function RotationEditor({
  onSave,
  specId,
}: Readonly<RotationEditorProps>) {
  const content = useIntlayer("rotationEditor");
  const assistant = useIntlayer("rotationAssistant");
  const script = useEditorDocument((s) => s.script);
  const addList = useEditorDocument((s) => s.addList);
  const removeList = useEditorDocument((s) => s.removeList);
  const updateList = useEditorDocument((s) => s.updateList);
  const saveAction = useEditorDocument((s) => s.saveAction);
  const dehydrate = useEditorDocument((s) => s.dehydrate);
  const openAddAction = useEditorUi((s) => s.openAddAction);
  const openEditAction = useEditorUi((s) => s.openEditAction);
  const closeDialog = useEditorUi((s) => s.closeDialog);
  const isDialogOpen = useEditorUi((s) => s.isDialogOpen);
  const editingAction = useEditorUi((s) => s.editingAction);
  const editingList = useEditorUi((s) => s.editingList);
  const selectionFocus = useEditorUi((s) => s.selectionFocus);
  const setSelectionFocus = useEditorUi((s) => s.setSelectionFocus);
  const openAssistant = useAssistantStore((s) => s.open);
  const [listParam, setListParam] = useQueryState(
    "list",
    parseAsString.withDefault(""),
  );
  const validation = useRotationValidation(specId);
  const issuesIndex = useActionIssues(validation, script.lists);
  const { conditionCtx, spellSlugs } = useEditorContext(specId);
  const listNames = Object.keys(script.lists);
  const focusedList = selectionFocus?.listId;
  const validFocused =
    focusedList && focusedList in script.lists ? focusedList : null;
  const validParam = listParam && listParam in script.lists ? listParam : null;
  const activeList = validFocused ?? validParam ?? listNames[0];
  const setActiveList = (name: string) => {
    void setListParam(name || null, { history: "replace", shallow: true });

    if (selectionFocus && selectionFocus.listId !== name) {
      setSelectionFocus(null);
    }
  };
  const currentActions = activeList ? (script.lists[activeList] ?? []) : [];
  const handleAddList = (name: string) => {
    addList(name);
    setActiveList(name);
  };

  const handleRemoveList = (name: string) => {
    removeList(name);

    if (activeList === name) {
      const remaining = listNames.find((n) => n !== name);

      setActiveList(remaining ?? "");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <ActionListsSidebar
          activeList={activeList}
          lists={script.lists}
          onAddList={handleAddList}
          onRemoveList={handleRemoveList}
          onSelectList={setActiveList}
        />

        <div className="min-w-0 flex-1">
          {activeList ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{activeList}</span>
                <span className="text-xs text-muted-foreground">
                  {content.actionCountLabel(currentActions.length)}
                </span>
              </div>
              <ActionListEditor
                actions={currentActions}
                issues={issuesIndex}
                listId={activeList}
                onChange={(actions) => updateList(activeList, actions)}
                onEditAction={(action) => openEditAction(activeList, action)}
                onAddAction={() => openAddAction(activeList)}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              {listNames.length > 0
                ? content.selectListEmpty
                : content.createListEmpty}
            </div>
          )}
        </div>
      </div>

      {onSave && (
        <div className="flex justify-end">
          <Button onClick={() => onSave(dehydrate())}>
            {content.saveRotationButton}
          </Button>
        </div>
      )}

      <ValidationStrip state={validation} />

      {validation.status === "errors" && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openAssistant("fix")}
          >
            <SparklesIcon className="size-3.5" />
            {assistant.fixWithAiButton}
          </Button>
        </div>
      )}

      <AssistantPanel specId={specId} />

      <ActionEditDialog
        action={editingAction}
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
        onSave={(action) => {
          saveAction(editingList, action);
          closeDialog();
        }}
        listNames={listNames}
        spellSlugs={spellSlugs}
        conditionCtx={conditionCtx}
      />
    </div>
  );
}
