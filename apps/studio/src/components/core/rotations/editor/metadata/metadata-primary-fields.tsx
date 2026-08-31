"use client";

import { kebabCase } from "change-case";
import { useIntlayer } from "next-intlayer";
import { useRef } from "react";

import { Input } from "@wowlab/shared/components/ui/input";
import { Label } from "@wowlab/shared/components/ui/label";

import { useEditorDocument } from "../editor-store-provider";
import { useMetadataDraftActions } from "./use-metadata-draft-actions";

export function MetadataPrimaryFields() {
  const content = useIntlayer("rotationEditor");
  const name = useEditorDocument((s) => s.metadata.name);
  const slug = useEditorDocument((s) => s.metadata.slug);
  const { commitMetadata, updateMetadataDraft } = useMetadataDraftActions();
  const slugTouchedRef = useRef<boolean>(slug !== "");

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs">{content.metadataNameLabel}</Label>
        <Input
          value={name}
          onChange={(event) => {
            const nextName = event.target.value;

            updateMetadataDraft(
              slugTouchedRef.current
                ? { name: nextName }
                : { name: nextName, slug: kebabCase(nextName) },
            );
          }}
          onBlur={commitMetadata}
          placeholder={content.metadataNamePlaceholder.value}
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{content.metadataSlugLabel}</Label>
        <Input
          value={slug}
          onChange={(event) => {
            slugTouchedRef.current = true;
            updateMetadataDraft({ slug: kebabCase(event.target.value) });
          }}
          onBlur={commitMetadata}
          placeholder={content.metadataSlugPlaceholder.value}
        />
      </div>
    </div>
  );
}
