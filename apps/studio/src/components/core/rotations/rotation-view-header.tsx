"use client";

import { GitForkIcon, PencilIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import type { Row } from "@wowlab/shared/lib/supabase/types";

import { GameSpec } from "@/components/shared/game";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import { Link } from "@wowlab/shared/components/ui/link";
import { href, routes } from "@wowlab/shared/lib/routing";

type RotationViewHeaderProps = {
  rotation: Row<"rotations">;
};

export function RotationViewHeader({
  rotation,
}: Readonly<RotationViewHeaderProps>) {
  const content = useIntlayer("rotations");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{rotation.name}</h1>
        <Badge variant="outline">
          {content.badgeVersion({ version: rotation.current_version })}
        </Badge>
        {rotation.forked_from_id && (
          <Badge variant="outline" className="gap-1">
            <GitForkIcon className="size-3" />
            {content.badgeForked}
          </Badge>
        )}
        <Button asChild size="sm" variant="outline" className="ml-auto gap-1">
          <Link href={href(routes.rotations.editor.edit, { id: rotation.id })}>
            <PencilIcon className="size-3" />
            {content.editButton}
          </Link>
        </Button>
      </div>
      <GameSpec specId={rotation.spec_id} />
      {rotation.description && (
        <p className="text-muted-foreground text-sm">{rotation.description}</p>
      )}
    </div>
  );
}
