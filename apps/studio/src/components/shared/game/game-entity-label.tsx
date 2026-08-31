"use client";

import { cn } from "@wowlab/shared/lib/utils";

import type { GameIconProps } from "./game-icon";
import type { GameTooltipProps } from "./game-tooltip";

import { GameLabel } from "./game-icon";
import { GameTooltip } from "./game-tooltip";
import { GameTooltipWrapper } from "./game-tooltip-wrapper";

export type GameEntityLabelProps = {
  className?: string;
  fallback: string;
  href?: string;
  isLoading: boolean;
  qualityClass?: string;
  size?: NonNullable<GameIconProps["size"]>;
  summary: GameEntitySummary | undefined;
  tooltip: GameTooltipProps;
};

export type GameEntitySummary = {
  file_name: string;
  name: string;
};

export function GameEntityLabel({
  className,
  fallback,
  href,
  isLoading,
  qualityClass,
  size = "sm",
  summary,
  tooltip,
}: Readonly<GameEntityLabelProps>) {
  return (
    <GameTooltipWrapper tooltip={<GameTooltip {...tooltip} />}>
      <span className="inline-block">
        <GameLabel
          className={cn(qualityClass, className)}
          fallback={fallback}
          href={href}
          iconName={summary?.file_name}
          loading={isLoading}
          name={summary?.name}
          size={size}
        />
      </span>
    </GameTooltipWrapper>
  );
}
