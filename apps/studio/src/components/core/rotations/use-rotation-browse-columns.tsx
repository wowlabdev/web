"use client";

import type { ReactNode } from "react";

import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";

import type { Row } from "@wowlab/shared/lib/supabase/types";

import { GameIcon } from "@/components/shared/game";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Link } from "@wowlab/shared/components/ui/link";
import { href, routes } from "@wowlab/shared/lib/routing";

import type { RotationBrowseSpec } from "./rotations-browse-content";

type BrowseColumn = {
  cell: (row: RotationRow) => ReactNode;
  className?: string;
  header: string;
};

type RotationRow = Row<"rotations">;

export function useRotationBrowseColumns(
  specMap: Map<number, RotationBrowseSpec>,
): BrowseColumn[] {
  const content = useIntlayer("rotations");
  const formatDate = useDate();

  return [
    {
      cell: (row) => {
        const spec = specMap.get(row.spec_id);

        return spec ? (
          <span className="inline-flex items-center gap-1.5">
            <GameIcon iconName={spec.file_name} size="sm" alt={spec.name} />
            <span className="text-muted-foreground text-xs">
              {spec.class_name}
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">{row.spec_id}</span>
        );
      },
      header: content.columnSpec.value,
    },
    {
      cell: (row) => (
        <Link
          href={href(routes.rotations.view, { id: row.id })}
          className="font-medium hover:underline"
        >
          {row.name}
        </Link>
      ),
      header: content.columnName.value,
    },
    {
      cell: (row) =>
        row.description ? (
          <span className="text-muted-foreground text-sm line-clamp-1">
            {row.description}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">
            {content.descriptionEmpty}
          </span>
        ),
      header: content.columnDescription.value,
    },
    {
      cell: (row) => (
        <Badge variant="outline">
          {content.badgeVersion({ version: row.current_version })}
        </Badge>
      ),
      className: "text-right",
      header: content.columnVersion.value,
    },
    {
      cell: (row) =>
        formatDate(new Date(row.updated_at), {
          dateStyle: "short",
        }),
      header: content.columnUpdated.value,
    },
  ];
}
