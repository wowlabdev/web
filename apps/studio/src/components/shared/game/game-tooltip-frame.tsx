"use client";

import type { ReactNode } from "react";

import type { GameTooltipSkeletonProps } from "./game-tooltip-skeleton";

import { GameTooltipSkeleton } from "./game-tooltip-skeleton";

export type GameTooltipFrameProps<T> = {
  children: (data: T) => ReactNode;
  data: T | undefined;
  fallback: ReactNode;
  isLoading: boolean;
  notFound: boolean;
  skeleton: GameTooltipSkeletonProps["kind"];
};

export function GameTooltipFrame<T>({
  children,
  data,
  fallback,
  isLoading,
  notFound,
  skeleton,
}: Readonly<GameTooltipFrameProps<T>>) {
  if (notFound) {
    return <>{fallback}</>;
  }

  if (isLoading || !data) {
    return <GameTooltipSkeleton kind={skeleton} />;
  }

  return <>{children(data)}</>;
}
