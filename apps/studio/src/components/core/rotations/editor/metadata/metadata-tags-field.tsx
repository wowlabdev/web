"use client";

import { useMemoizedFn } from "ahooks";
import { PlusIcon, XIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useState } from "react";

import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@wowlab/shared/components/ui/input-group";
import { Label } from "@wowlab/shared/components/ui/label";

import { useEditorDocument } from "../editor-store-provider";
import { useMetadataDraftActions } from "./use-metadata-draft-actions";

export function MetadataTagsField() {
  const content = useIntlayer("rotationEditor");
  const tags = useEditorDocument((s) => s.metadata.tags);
  const { commitMetadata, updateMetadataDraft } = useMetadataDraftActions();
  const [tagDraft, setTagDraft] = useState("");

  const commitTag = useMemoizedFn(() => {
    const next = tagDraft.trim();

    if (!next) {
      return;
    }

    if (tags.includes(next)) {
      setTagDraft("");

      return;
    }

    updateMetadataDraft({ tags: [...tags, next] });
    setTagDraft("");
    commitMetadata();
  });

  const removeTag = (tag: string) => {
    updateMetadataDraft({ tags: tags.filter((t) => t !== tag) });
    commitMetadata();
  };

  return (
    <div className="space-y-1">
      <Label className="text-xs">{content.metadataTagsLabel}</Label>
      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={content.metadataTagsRemoveAria.value}
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3" />
            </button>
          </Badge>
        ))}
        <InputGroup className="w-40">
          <InputGroupInput
            value={tagDraft}
            onChange={(event) => setTagDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                commitTag();
              }
            }}
            onBlur={commitTag}
            placeholder={content.metadataTagsPlaceholder.value}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label={content.metadataTagsAddAriaLabel.value}
              onClick={commitTag}
            >
              <PlusIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}
