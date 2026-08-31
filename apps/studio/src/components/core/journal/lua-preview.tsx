"use client";

import { useIntlayer } from "next-intlayer";

import { useFilesDownload } from "@/hooks/use-files-download";
import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import { Button } from "@wowlab/shared/components/ui/button";

import type { LootModelFile } from "./export-serialization";

type LuaPreviewProps = {
  canPrepare: boolean;
  files: LootModelFile[];
  isFetching: boolean;
  isStale: boolean;
  lua: string;
  onPrepare: () => void;
};

export function LuaPreview({
  canPrepare,
  files,
  isFetching,
  isStale,
  lua,
  onPrepare,
}: Readonly<LuaPreviewProps>) {
  const content = useIntlayer("journalPage");
  const { downloadZip } = useFilesDownload();
  const hasData = files.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{content.exportLuaTitle}</p>
        <div className="flex items-center gap-2">
          {isStale && (
            <span className="text-[11px] text-amber-500">
              {content.exportSelectionChanged}
            </span>
          )}
          {isFetching && (
            <span className="text-[11px] text-muted-foreground">
              {content.exportLoadingLoot}
            </span>
          )}
          <Button
            disabled={!canPrepare || isFetching || (hasData && !isStale)}
            size="xs"
            onClick={onPrepare}
          >
            {content.exportPrepareData}
          </Button>
          <Button
            disabled={!hasData}
            size="xs"
            variant="outline"
            onClick={() =>
              downloadZip(
                files.map((file) => ({
                  content: file.lua,
                  fileName: file.fileName,
                })),
                "wowlab-loot-model.zip",
              )
            }
          >
            {content.exportDownloadFiles({ count: files.length })}
          </Button>
          <CopyButton value={lua} />
        </div>
      </div>
      <pre
        aria-live="polite"
        className="max-h-56 overflow-auto border bg-muted/20 p-3 text-[11px] leading-relaxed"
      >
        {lua ||
          (isFetching
            ? content.exportLoadingLoot
            : content.exportPreparePrompt)}
      </pre>
    </div>
  );
}
