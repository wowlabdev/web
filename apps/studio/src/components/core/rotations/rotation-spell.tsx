"use client";

import { useIntlayer } from "next-intlayer";

import { GameAura, GameSpell } from "@/components/shared/game";

import type { SpecSpellMap } from "./rotation-view-types";

import { formatSlug } from "./format-slug";

export function RotationAura({
  slug,
  specMap,
  suffix,
}: Readonly<{
  slug: string | undefined;
  specMap: SpecSpellMap | null;
  suffix?: string;
}>) {
  if (!slug) {
    return null;
  }

  const auraId = specMap?.auras.get(slug);
  const spellId = specMap?.spells.get(slug);
  const resolvedId = auraId ?? spellId;

  if (resolvedId !== undefined) {
    return (
      <>
        <GameAura spellId={resolvedId} size="sm" specId={specMap?.specId} />
        {suffix && <span>{suffix}</span>}
      </>
    );
  }

  return (
    <span>
      {formatSlug(slug)}
      {suffix && ` ${suffix}`}
    </span>
  );
}

export function RotationSpell({
  slug,
  specMap,
}: Readonly<{
  slug: string | undefined;
  specMap: SpecSpellMap | null;
}>) {
  const content = useIntlayer("rotations");

  if (!slug) {
    return <span>{content.spellUnknown}</span>;
  }

  const spellId = specMap?.spells.get(slug);

  if (spellId !== undefined) {
    return <GameSpell id={spellId} size="sm" specId={specMap?.specId} />;
  }

  const auraId = specMap?.auras.get(slug);

  if (auraId !== undefined) {
    return <GameAura spellId={auraId} size="sm" specId={specMap?.specId} />;
  }

  return <span>{formatSlug(slug)}</span>;
}
