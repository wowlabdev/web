"use client";

import { ChevronDownIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@wowlab/shared/components/ui/collapsible";

import { MetadataDescriptionField } from "./metadata-description-field";
import { MetadataIdBadges } from "./metadata-id-badges";
import { MetadataTagsField } from "./metadata-tags-field";
import { MetadataVisibilityField } from "./metadata-visibility-field";

export function MetadataAdvancedSection() {
  const content = useIntlayer("rotationEditor");

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between">
          {content.metadataAdvancedToggle}
          <ChevronDownIcon className="size-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-2">
        <MetadataDescriptionField />
        <MetadataTagsField />
        <MetadataVisibilityField />
        <MetadataIdBadges />
      </CollapsibleContent>
    </Collapsible>
  );
}
