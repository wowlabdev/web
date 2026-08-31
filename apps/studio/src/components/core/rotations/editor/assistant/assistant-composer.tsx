"use client";

import { ListPlusIcon, SendIcon, WandSparklesIcon, XIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import { Textarea } from "@wowlab/shared/components/ui/textarea";

import type { ComposerMode } from "./assistant-presets";

type AssistantComposerProps = {
  mode: ComposerMode;
  input: string;
  busy: boolean;
  activeList: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onCancelMode: () => void;
};

export function AssistantComposer({
  activeList,
  busy,
  input,
  mode,
  onCancelMode,
  onInputChange,
  onSend,
}: Readonly<AssistantComposerProps>) {
  const content = useIntlayer("rotationAssistant");

  const placeholder = (() => {
    if (mode === "simc") {
      return content.simcPlaceholder.value;
    }

    if (mode === "chat") {
      return content.chatPlaceholder.value;
    }

    return content.promptPlaceholder.value;
  })();

  const modeLabel = (() => {
    if (mode === "list") {
      return content.listTargetLabel({ list: activeList });
    }

    return mode === "simc"
      ? content.capabilityImportSimc
      : content.capabilityGenerateRotation;
  })();

  return (
    <div className="border-t p-3">
      {mode !== "chat" && (
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            {mode === "list" && <ListPlusIcon className="size-3" />}
            {modeLabel}
          </Badge>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={content.cancelModeAriaLabel.value}
            onClick={onCancelMode}
          >
            <XIcon className="size-3" />
          </Button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          rows={mode === "simc" ? 6 : 2}
          className="min-h-0 resize-none"
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <Button
          size="icon"
          disabled={!input.trim() || busy}
          aria-label={content.sendButton.value}
          onClick={onSend}
        >
          {mode === "chat" ? (
            <SendIcon className="size-4" />
          ) : (
            <WandSparklesIcon className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
