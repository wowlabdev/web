"use client";

import { SearchIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { ActionRowIconButton } from "./action-row-icon-button";

type ActionDiagnoseButtonProps = {
  onDiagnose: () => void;
};

export function ActionDiagnoseButton({
  onDiagnose,
}: Readonly<ActionDiagnoseButtonProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <ActionRowIconButton
      icon={SearchIcon}
      onClick={onDiagnose}
      ariaLabel={content.diagnoseActionAriaLabel.value}
    />
  );
}
