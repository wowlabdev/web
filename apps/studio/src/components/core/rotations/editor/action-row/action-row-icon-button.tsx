"use client";

import type { LucideIcon } from "lucide-react";

import { Button } from "@wowlab/shared/components/ui/button";

type ActionRowIconButtonProps = {
  ariaLabel: string;
  icon: LucideIcon;
  onClick: () => void;
};

export function ActionRowIconButton({
  ariaLabel,
  icon: Icon,
  onClick,
}: Readonly<ActionRowIconButtonProps>) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="size-6"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-label={ariaLabel}
    >
      <Icon className="size-3" />
    </Button>
  );
}
