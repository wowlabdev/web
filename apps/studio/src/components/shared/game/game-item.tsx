"use client";

import { useIntlayer } from "next-intlayer";

import { useItemSummary } from "@/lib/game-data";
import { QUALITY_CLASSES } from "@/lib/game/quality";

import { GameEntityLabel } from "./game-entity-label";
import { type GameIconProps } from "./game-icon";

export type GameItemProps = {
  className?: string;
  id: number;
  size?: NonNullable<GameIconProps["size"]>;
};

export function GameItem({
  className,
  id,
  size = "sm",
}: Readonly<GameItemProps>) {
  const content = useIntlayer("gameComponents");
  const { data: item, isLoading } = useItemSummary(id);

  return (
    <GameEntityLabel
      className={className}
      fallback={content.itemFallback({ id }).value}
      isLoading={isLoading}
      qualityClass={item ? (QUALITY_CLASSES[item.quality] ?? "") : ""}
      size={size}
      summary={item}
      tooltip={{ id, kind: "item" }}
    />
  );
}
