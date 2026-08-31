"use client";

import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";

import { useEditorDocument } from "../editor-store-provider";

export function MetadataIdBadges() {
  const content = useIntlayer("rotationEditor");
  const rotationId = useEditorDocument((s) => s.metadata.rotationId);
  const forkedFromId = useEditorDocument((s) => s.metadata.forkedFromId);

  if (!rotationId && !forkedFromId) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
      {rotationId && (
        <Badge variant="outline" className="font-mono">
          {content.metadataIdBadgeId}: {rotationId}
        </Badge>
      )}
      {forkedFromId && (
        <Badge variant="outline" className="font-mono">
          {content.metadataIdBadgeFork}: {forkedFromId}
        </Badge>
      )}
    </div>
  );
}
