"use client";

import { MoreHorizontalIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@wowlab/shared/components/ui/dropdown-menu";
import { useClipboard } from "@wowlab/shared/hooks/use-clipboard";

import { useEditorDocument } from "../editor-store-provider";
import { downloadJson } from "../lib/export-json";

export function EditorToolbarExportMenu() {
  const content = useIntlayer("rotationEditor");
  const { copy } = useClipboard();
  const dehydrate = useEditorDocument((s) => s.dehydrate);
  const slug = useEditorDocument((s) => s.metadata.slug);

  const handleCopyJson = () => {
    const snapshot = dehydrate();

    void copy(JSON.stringify(snapshot, null, 2));
  };

  const handleExportJson = () => {
    const snapshot = dehydrate();

    downloadJson(
      `${slug.trim() || "rotation"}.json`,
      JSON.stringify(snapshot, null, 2),
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={content.moreActionsAriaLabel.value}
        >
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={handleExportJson}>
          {content.menuExportJson}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleCopyJson}>
          {content.menuCopyJson}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
