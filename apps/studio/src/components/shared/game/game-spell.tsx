"use client";

import { useIntlayer } from "next-intlayer";

import { useSpellSummary } from "@/lib/game-data";

import { GameEntityLabel } from "./game-entity-label";
import { type GameIconProps } from "./game-icon";

export type GameSpellProps = {
  className?: string;
  href?: string;
  id: number;
  size?: NonNullable<GameIconProps["size"]>;
  specId?: number;
};

export function GameSpell({
  className,
  href,
  id,
  size = "sm",
  specId,
}: Readonly<GameSpellProps>) {
  const content = useIntlayer("gameComponents");
  const { data: spell, isLoading } = useSpellSummary(id);

  return (
    <GameEntityLabel
      className={className}
      fallback={content.spellFallback({ id }).value}
      href={href}
      isLoading={isLoading}
      size={size}
      summary={spell}
      tooltip={{ id, kind: "spell", specId }}
    />
  );
}
