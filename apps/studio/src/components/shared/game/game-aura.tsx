"use client";

import { useIntlayer } from "next-intlayer";

import { useSpellSummary } from "@/lib/game-data";

import { GameEntityLabel } from "./game-entity-label";
import { type GameIconProps } from "./game-icon";

export type GameAuraProps = {
  className?: string;
  href?: string;
  size?: NonNullable<GameIconProps["size"]>;
  spellId: number;
  specId?: number;
};

export function GameAura({
  className,
  href,
  size = "sm",
  specId,
  spellId,
}: Readonly<GameAuraProps>) {
  const content = useIntlayer("gameComponents");
  const { data: spell, isLoading } = useSpellSummary(spellId);

  return (
    <GameEntityLabel
      className={className}
      fallback={content.auraFallback({ id: spellId }).value}
      href={href}
      isLoading={isLoading}
      size={size}
      summary={spell}
      tooltip={{ id: spellId, kind: "aura", specId }}
    />
  );
}
