"use client";

import { useIntlayer } from "next-intlayer";

import { useItem, useResolvedItem, useSpellSummary } from "@/lib/game-data";

import { GameTooltipFrame } from "./game-tooltip-frame";
import { ItemTooltipBody, SpellTooltipBody } from "./renderers";

export type GameTooltipProps =
  | { bonusIds?: number[]; id: number; kind: "item" }
  | { id: number; kind: "aura"; specId?: number }
  | { id: number; kind: "spell"; specId?: number };

const EMPTY_BONUS_IDS: number[] = [];

export function GameTooltip(props: Readonly<GameTooltipProps>) {
  if (props.kind === "item") {
    return <ItemTooltip bonusIds={props.bonusIds} id={props.id} />;
  }

  return <SpellTooltip id={props.id} specId={props.specId} />;
}

function ItemTooltip({
  bonusIds = EMPTY_BONUS_IDS,
  id,
}: Readonly<{ bonusIds?: number[]; id: number }>) {
  const content = useIntlayer("gameComponents");
  const { data: item, isLoading: itemLoading, notFound } = useItem(id);
  const { data: resolved, isLoading: resolvedLoading } = useResolvedItem(
    item,
    bonusIds,
  );

  return (
    <GameTooltipFrame
      data={resolved}
      fallback={<span>{content.itemFallback({ id })}</span>}
      isLoading={itemLoading || resolvedLoading}
      notFound={notFound}
      skeleton="item"
    >
      {(value) => <ItemTooltipBody resolved={value} />}
    </GameTooltipFrame>
  );
}

function SpellTooltip({
  id,
  specId,
}: Readonly<{ id: number; specId?: number }>) {
  const content = useIntlayer("gameComponents");
  const { data: spell, isLoading, notFound } = useSpellSummary(id);

  return (
    <GameTooltipFrame
      data={spell}
      fallback={<span>{content.spellFallback({ id })}</span>}
      isLoading={isLoading}
      notFound={notFound}
      skeleton="spell"
    >
      {(value) => (
        <SpellTooltipBody spell={value} spellId={id} specId={specId} />
      )}
    </GameTooltipFrame>
  );
}
