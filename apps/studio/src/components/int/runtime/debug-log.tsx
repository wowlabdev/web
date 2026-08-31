"use client";

import { useMemoizedFn } from "ahooks";
import { CopyIcon, EraserIcon, KeyRoundIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { useConfirm } from "@/components/shared/ui/confirm-dialog";
import { clearStoredKeypair, useRuntimeStore } from "@/lib/node";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { ScrollArea } from "@wowlab/shared/components/ui/scroll-area";
import { useClipboard } from "@wowlab/shared/hooks/use-clipboard";
import { cn } from "@wowlab/shared/lib/utils";

export function DebugLog() {
  const content = useIntlayer("runtimePage");
  const confirm = useConfirm();
  const debugLog = useRuntimeStore((s) => s.debugLog);
  const clearLog = useRuntimeStore((s) => s.clearLog);
  const { copy } = useClipboard();

  const handleReset = useMemoizedFn(async () => {
    const confirmed = await confirm({
      confirmLabel: content.debugReset,
      description: content.debugResetConfirm,
      isDestructive: true,
    });

    if (!confirmed) {
      return;
    }

    clearStoredKeypair();
    window.location.reload();
  });

  return (
    <Card className="gap-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm">{content.debugTitle}</CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={clearLog}
          >
            <EraserIcon className="size-3.5" />
            {content.debugClear}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              void copy(debugLog.join("\n"));
            }}
          >
            <CopyIcon className="size-3.5" />
            {content.debugCopy}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive h-7 text-xs"
            onClick={() => {
              void handleReset();
            }}
          >
            <KeyRoundIcon className="size-3.5" />
            {content.debugReset}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="bg-muted/40 max-h-64 rounded-md border p-3">
          {debugLog.length === 0 ? (
            <span className="text-muted-foreground font-mono text-[11px]">
              {content.debugWaiting}
            </span>
          ) : (
            debugLog.map((line, index) => (
              <div
                // eslint-disable-next-line @eslint-react/no-array-index-key -- append-only log lines are not unique; positional index is the stable identity
                key={`${index}-${line}`}
                className={cn(
                  "font-mono text-[11px] leading-5",
                  resolveLogLineClass(line),
                )}
              >
                {line}
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function resolveLogLineClass(line: string): string {
  if (line.includes("Error")) {
    return "text-red-400";
  }

  if (
    line.includes("Got") ||
    line.includes("Connected") ||
    line.includes("Authenticated")
  ) {
    return "text-green-400";
  }

  return "text-muted-foreground";
}
