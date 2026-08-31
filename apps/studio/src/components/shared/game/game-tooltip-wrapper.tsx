import type { ReactNode } from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@wowlab/shared/components/ui/hover-card";

export type GameTooltipWrapperProps = {
  children: ReactNode;
  tooltip: ReactNode;
};

export function GameTooltipWrapper({
  children,
  tooltip,
}: Readonly<GameTooltipWrapperProps>) {
  return (
    <HoverCard openDelay={150} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        sideOffset={6}
        className="w-auto max-w-none bg-transparent p-0 shadow-none ring-0"
      >
        {tooltip}
      </HoverCardContent>
    </HoverCard>
  );
}
