"use client";

import type { ComponentProps, Dispatch, SetStateAction } from "react";

import { Sheet, SheetContent } from "@wowlab/shared/components/ui/sheet";

import type { ComposerMode } from "./assistant-presets";
import type { PromptAction } from "./prompt-registry";
import type { Candidate, useAssistantChat } from "./use-assistant-chat";

import { AssistantComposer } from "./assistant-composer";
import { AssistantPanelHeader } from "./assistant-panel-header";
import { AssistantPresets } from "./assistant-presets";
import { AssistantResizeHandle } from "./assistant-resize-handle";
import { AssistantThread } from "./assistant-thread";

type AssistantPanelContentProps = {
  activeList: string;
  chat: ReturnType<typeof useAssistantChat>;
  input: string;
  isOpen: boolean;
  hasValidationErrors: boolean;
  mode: ComposerMode;
  onApply: (id: number, candidate: Candidate) => void;
  onClose: () => void;
  onPremadePrompt: (action: PromptAction) => void;
  onSend: () => void;
  resizeHandleProps: ComponentProps<typeof AssistantResizeHandle>;
  setInput: Dispatch<SetStateAction<string>>;
  setMode: Dispatch<SetStateAction<ComposerMode>>;
  transcript: string;
  width: number;
};

export function AssistantPanelContent({
  activeList,
  chat,
  hasValidationErrors,
  input,
  isOpen,
  mode,
  onApply,
  onClose,
  onPremadePrompt,
  onSend,
  resizeHandleProps,
  setInput,
  setMode,
  transcript,
  width,
}: Readonly<AssistantPanelContentProps>) {
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(isNextOpen) => !isNextOpen && onClose()}
    >
      <SheetContent
        className="gap-0 p-0 sm:max-w-none"
        showCloseButton={false}
        side="right"
        style={{ maxWidth: "100vw", width }}
      >
        <AssistantResizeHandle {...resizeHandleProps} />
        <AssistantPanelHeader
          entryCount={chat.entries.length}
          isBusy={chat.busy}
          onClear={chat.reset}
          onClose={onClose}
          transcript={transcript}
          usage={chat.usageTotal}
        />
        <AssistantPresets
          hasErrors={hasValidationErrors}
          mode={mode}
          onPremadePrompt={onPremadePrompt}
          onSelectMode={setMode}
        />
        <AssistantThread
          busy={chat.busy}
          entries={chat.entries}
          onApply={onApply}
          onDiscard={chat.markApplied}
        />
        <AssistantComposer
          activeList={activeList}
          busy={chat.busy}
          input={input}
          mode={mode}
          onCancelMode={() => setMode("chat")}
          onInputChange={setInput}
          onSend={onSend}
        />
      </SheetContent>
    </Sheet>
  );
}
