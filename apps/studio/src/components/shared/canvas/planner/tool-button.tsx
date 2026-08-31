"use client";

import { type ReactNode } from "react";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wowlab/shared/components/ui/tooltip";

type ToolButtonProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
};

export function ToolButton({
  icon,
  isActive,
  isDisabled,
  label,
  onClick,
}: Readonly<ToolButtonProps>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant={isActive ? "default" : "ghost"}
          disabled={isDisabled}
          onClick={onClick}
          className="size-8 p-0"
          aria-label={label}
          aria-pressed={isActive}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
