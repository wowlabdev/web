"use client";

import { PencilIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { ActionRowIconButton } from "./action-row-icon-button";

type ActionEditButtonProps = {
  onEdit: () => void;
};

export function ActionEditButton({ onEdit }: Readonly<ActionEditButtonProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <ActionRowIconButton
      icon={PencilIcon}
      onClick={onEdit}
      ariaLabel={content.actionEditAriaLabel.value}
    />
  );
}
