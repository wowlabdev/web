"use client";

import { useIntlayer } from "next-intlayer";

import { Label } from "@wowlab/shared/components/ui/label";
import { Textarea } from "@wowlab/shared/components/ui/textarea";

import { useEditorDocument } from "../editor-store-provider";
import { useMetadataDraftActions } from "./use-metadata-draft-actions";

export function MetadataDescriptionField() {
  const content = useIntlayer("rotationEditor");
  const description = useEditorDocument((s) => s.metadata.description);
  const { commitMetadata, updateMetadataDraft } = useMetadataDraftActions();

  return (
    <div className="space-y-1">
      <Label className="text-xs">{content.metadataDescriptionLabel}</Label>
      <Textarea
        value={description}
        onChange={(event) =>
          updateMetadataDraft({ description: event.target.value })
        }
        onBlur={commitMetadata}
        placeholder={content.metadataDescriptionPlaceholder.value}
      />
    </div>
  );
}
