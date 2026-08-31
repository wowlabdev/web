"use client";

import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@wowlab/shared/components/ui/dialog";
import { Label } from "@wowlab/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import { useActionTypeLabels } from "../action-type-labels";
import { ActionFieldsEditor } from "./action-fields/action-fields-editor";
import { TargetIfFields } from "./action-fields/target-if-fields";
import { ConditionBuilder } from "./condition/condition-builder";
import {
  type Action,
  ACTION_TYPES,
  type ActionEntry,
  type ConditionEditorCtx,
  createDefaultAction,
  createDefaultCondition,
} from "./types";

type ActionEditDialogProps = {
  action: ActionEntry | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (action: ActionEntry) => void;
  listNames: string[];
  spellSlugs: string[];
  conditionCtx: ConditionEditorCtx;
};

type ActionEditFormProps = {
  action: ActionEntry | null;
  conditionCtx: ConditionEditorCtx;
  listNames: string[];
  onCancel: () => void;
  onSave: (draft: ActionEntry) => void;
  spellSlugs: string[];
};

export function ActionEditDialog({
  action,
  conditionCtx,
  isOpen,
  listNames,
  onOpenChange,
  onSave,
  spellSlugs,
}: Readonly<ActionEditDialogProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {action ? content.dialogEditTitle : content.dialogAddTitle}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <ActionEditForm
            key={action?.id ?? "new"}
            action={action}
            conditionCtx={conditionCtx}
            listNames={listNames}
            onCancel={() => onOpenChange(false)}
            onSave={(draft) => {
              onSave(draft);
              onOpenChange(false);
            }}
            spellSlugs={spellSlugs}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ActionEditForm({
  action,
  conditionCtx,
  listNames,
  onCancel,
  onSave,
  spellSlugs,
}: Readonly<ActionEditFormProps>) {
  const content = useIntlayer("rotationEditor");
  const typeLabels = useActionTypeLabels();
  const [draft, setDraft] = useState<ActionEntry>(() =>
    action ? { ...action } : createDefaultAction(),
  );

  const update = (patch: Partial<ActionEntry>) =>
    setDraft((d) => ({ ...d, ...patch }));

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">{content.actionTypeLabel}</Label>
          <Select
            value={draft.type}
            onValueChange={(t) => update({ type: t as Action["type"] })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {typeLabels[t.value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ActionFieldsEditor
          draft={draft}
          onChange={update}
          listNames={listNames}
          spellSlugs={spellSlugs}
        />

        <div className="space-y-1.5">
          <Label className="text-xs">{content.conditionLabel}</Label>
          <ConditionBuilder
            value={draft.condition ?? createDefaultCondition()}
            onChange={(condition) => update({ condition })}
            ctx={conditionCtx}
          />
        </div>

        {draft.type === "cast" && (
          <TargetIfFields
            draft={draft}
            onChange={update}
            conditionCtx={conditionCtx}
          />
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          {content.cancelButton}
        </Button>
        <Button onClick={() => onSave(draft)}>
          {action ? content.saveButton : content.submitAddButton}
        </Button>
      </DialogFooter>
    </>
  );
}
