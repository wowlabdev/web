"use client";

import { SparklesIcon, Trash2Icon, XIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";

import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@wowlab/shared/components/ui/sheet";

type AssistantPanelHeaderProps = {
  entryCount: number;
  isBusy: boolean;
  onClear: () => void;
  onClose: () => void;
  transcript: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
};

export function AssistantPanelHeader({
  entryCount,
  isBusy,
  onClear,
  onClose,
  transcript,
  usage,
}: Readonly<AssistantPanelHeaderProps>) {
  const content = useIntlayer("rotationAssistant");
  const formatNumber = useNumber();
  const hasUsage = usage.inputTokens > 0 || usage.outputTokens > 0;

  return (
    <SheetHeader className="flex-row items-center justify-between gap-2 border-b">
      <div className="min-w-0">
        <SheetTitle className="flex items-center gap-2">
          <SparklesIcon className="size-4" />
          {content.assistantTitle}
        </SheetTitle>
        <SheetDescription>{content.assistantDescription}</SheetDescription>
      </div>
      <div className="flex items-center gap-1">
        {hasUsage ? (
          <span className="text-muted-foreground mr-1 text-xs whitespace-nowrap">
            {content.sessionUsage({
              input: formatNumber(usage.inputTokens),
              output: formatNumber(usage.outputTokens),
            })}
          </span>
        ) : null}
        {transcript ? <CopyButton value={transcript} /> : null}
        <Button
          aria-label={content.clearAriaLabel.value}
          disabled={entryCount === 0 || isBusy}
          onClick={onClear}
          size="icon-sm"
          variant="ghost"
        >
          <Trash2Icon className="size-4" />
        </Button>
        <Button
          aria-label={content.closeAriaLabel.value}
          onClick={onClose}
          size="icon-sm"
          variant="ghost"
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    </SheetHeader>
  );
}
