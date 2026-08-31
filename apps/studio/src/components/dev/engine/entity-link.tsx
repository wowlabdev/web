"use client";

import { Search } from "lucide-react";

import { GameAura, GameSpell } from "@/components/shared/game";
import {
  makeGitHubSearchUrl,
  makeWowheadSpellUrl,
} from "@wowlab/shared/lib/links";

type EntityLinkProps = {
  id: number;
  kind: "spell" | "aura";
};

export function EntityLink({ id, kind }: Readonly<EntityLinkProps>) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {kind === "spell" ? (
        <GameSpell id={id} href={makeWowheadSpellUrl(id)} />
      ) : (
        <GameAura spellId={id} href={makeWowheadSpellUrl(id)} />
      )}
      <a
        href={makeGitHubSearchUrl(String(id))}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <Search className="size-3" />
      </a>
    </span>
  );
}
