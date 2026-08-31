"use client";

import { TrashIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { ActionRowIconButton } from "./action-row-icon-button";

type ActionDeleteButtonProps = {
  onDelete: () => void;
};

export function ActionDeleteButton({
  onDelete,
}: Readonly<ActionDeleteButtonProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <ActionRowIconButton
      icon={TrashIcon}
      onClick={onDelete}
      ariaLabel={content.actionDeleteAriaLabel.value}
    />
  );
}
