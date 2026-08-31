"use client";

import { useIntlayer } from "next-intlayer";

import { Label } from "@wowlab/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";

import { useEditorDocument } from "../editor-store-provider";
import { useMetadataDraftActions } from "./use-metadata-draft-actions";

export function MetadataVisibilityField() {
  const content = useIntlayer("rotationEditor");
  const isPublic = useEditorDocument((s) => s.metadata.isPublic);
  const { commitMetadata, updateMetadataDraft } = useMetadataDraftActions();

  return (
    <div className="space-y-1">
      <Label className="text-xs">{content.metadataVisibilityLabel}</Label>
      <Select
        value={isPublic ? "public" : "private"}
        onValueChange={(value) => {
          updateMetadataDraft({ isPublic: value === "public" });
          commitMetadata();
        }}
      >
        <SelectTrigger size="sm" className="h-8 w-40 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="private">
            {content.metadataVisibilityPrivate}
          </SelectItem>
          <SelectItem value="public">
            {content.metadataVisibilityPublic}
          </SelectItem>
        </SelectContent>
      </Select>
      <p className="text-[10px] text-muted-foreground">
        {content.metadataVisibilityHint}
      </p>
    </div>
  );
}
