"use client";

import type { ImplementedSpecInfo } from "wowlab-common";

import { ChevronDown, ChevronRight, Swords } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import { GameSpec } from "@/components/shared/game";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { GitHubIcon } from "@wowlab/shared/lib/icons";
import {
  makeGitHubManifestUrl,
  makeItemsReportUrl,
} from "@wowlab/shared/lib/links";

export function useSpecColumns(expandedSpecId: number | null) {
  const content = useIntlayer("enginePage");

  return useMemo(
    () => [
      {
        cell: (row: ImplementedSpecInfo) => (
          <span className="inline-flex items-center gap-2">
            {expandedSpecId === row.spec_id ? (
              <ChevronDown className="text-muted-foreground size-4" />
            ) : (
              <ChevronRight className="text-muted-foreground size-4" />
            )}
            <GameSpec specId={row.spec_id} />
            <a
              href={makeGitHubManifestUrl(row.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label={content.openManifestAria({ slug: row.slug }).value}
            >
              <GitHubIcon className="size-3.5" />
            </a>
            <a
              href={makeItemsReportUrl(row.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label={content.openItemsReportAria({ slug: row.slug }).value}
            >
              <Swords className="size-3.5" />
            </a>
          </span>
        ),
        header: content.spec.value,
      },
      {
        cell: (row: ImplementedSpecInfo) => (
          <Badge variant="secondary">{row.spell_count}</Badge>
        ),
        header: content.spells.value,
      },
      {
        cell: (row: ImplementedSpecInfo) => (
          <Badge variant="secondary">{row.aura_count}</Badge>
        ),
        header: content.auras.value,
      },
      {
        cell: (row: ImplementedSpecInfo) => (
          <Badge variant="outline">{row.talent_count}</Badge>
        ),
        className: "text-end pr-6",
        header: content.talents.value,
      },
    ],
    [content, expandedSpecId],
  );
}
