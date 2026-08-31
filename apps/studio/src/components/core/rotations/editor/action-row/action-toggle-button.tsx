"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { ActionRowIconButton } from "./action-row-icon-button";

type ActionToggleButtonProps = {
  isDisabled: boolean;
  onToggle: () => void;
};

export function ActionToggleButton({
  isDisabled,
  onToggle,
}: Readonly<ActionToggleButtonProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <ActionRowIconButton
      icon={isDisabled ? EyeOffIcon : EyeIcon}
      onClick={onToggle}
      ariaLabel={
        isDisabled
          ? content.actionEnableAriaLabel.value
          : content.actionDisableAriaLabel.value
      }
    />
  );
}
