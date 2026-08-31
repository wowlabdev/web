"use client";

import { ActionDeleteButton } from "./action-delete-button";
import { ActionDiagnoseButton } from "./action-diagnose-button";
import { ActionEditButton } from "./action-edit-button";
import { ActionToggleButton } from "./action-toggle-button";

type ActionRowActionsProps = {
  isDisabled: boolean;
  onDelete: () => void;
  onDiagnose: () => void;
  onEdit: () => void;
  onToggle: () => void;
};

export function ActionRowActions({
  isDisabled,
  onDelete,
  onDiagnose,
  onEdit,
  onToggle,
}: Readonly<ActionRowActionsProps>) {
  return (
    <div className="flex shrink-0 gap-0.5">
      <ActionToggleButton isDisabled={isDisabled} onToggle={onToggle} />
      <ActionDiagnoseButton onDiagnose={onDiagnose} />
      <ActionEditButton onEdit={onEdit} />
      <ActionDeleteButton onDelete={onDelete} />
    </div>
  );
}
