"use client";

import { useMemoizedFn } from "ahooks";
import { useIntlayer } from "next-intlayer";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import type { ComposerMode } from "./assistant-presets";
import type { PromptAction } from "./prompt-registry";
import type { Candidate } from "./use-assistant-chat";

import { useEditorDocument, useEditorUi } from "../editor-store-provider";
import { addActionIds } from "../types";
import { AssistantPanelContent } from "./assistant-panel-content";
import { useAssistantStore } from "./assistant-store";
import { buildAssistantTranscript } from "./assistant-transcript";
import { renderPrompt } from "./prompt-registry";
import { useAiObject } from "./use-ai-object";
import { useAssistantChat } from "./use-assistant-chat";
import { useAssistantContext } from "./use-assistant-context";
import { useAssistantWidth } from "./use-assistant-width";

type AssistantPanelProps = {
  specId: number;
};

export function AssistantPanel({ specId }: Readonly<AssistantPanelProps>) {
  const content = useIntlayer("rotationAssistant");
  const isOpen = useAssistantStore((s) => s.isOpen);
  const intent = useAssistantStore((s) => s.intent);
  const close = useAssistantStore((s) => s.close);
  const consumeIntent = useAssistantStore((s) => s.consumeIntent);

  const ctx = useAssistantContext(specId);
  const replaceScript = useEditorDocument((s) => s.replaceScript);
  const updateList = useEditorDocument((s) => s.updateList);
  const validation = useEditorUi((s) => s.validation);
  const selectionFocus = useEditorUi((s) => s.selectionFocus);

  const [listParam] = useQueryState("list", parseAsString.withDefault(""));
  const [mode, setMode] = useState<ComposerMode>("chat");
  const [input, setInput] = useState("");

  const chat = useAssistantChat();
  const { generate } = useAiObject();
  const { resizeHandleProps, width } = useAssistantWidth();

  const transcript = buildAssistantTranscript(chat.entries, {
    assistant: content.transcriptAssistant.value,
    user: content.transcriptUser.value,
  });

  const base = ctx.dehydrate();
  const activeList =
    listParam && listParam in base.lists
      ? listParam
      : (Object.keys(base.lists)[0] ?? "main");

  const runStructured = useMemoizedFn(
    async (
      kind: "rotation" | "list",
      request: string,
      display: string,
      targetList?: string,
    ) => {
      chat.pushUser(display);
      chat.setBusy(true);

      try {
        const outcome = await generate({
          baseRotation: base,
          contextMarkdown: ctx.buildContextMarkdown(),
          grammar: ctx.grammar,
          kind,
          request,
          specId,
          targetList,
        });

        switch (outcome.status) {
          case "invalid": {
            chat.pushInvalid(outcome.errors);
            break;
          }

          case "not_configured": {
            chat.pushError("not_configured");
            break;
          }

          case "ready": {
            chat.pushCandidate(outcome);
            break;
          }

          default: {
            chat.pushError("failed");
          }
        }
      } catch {
        chat.pushError("failed");
      } finally {
        chat.setBusy(false);
      }
    },
  );

  const runPremade = useMemoizedFn((action: PromptAction) => {
    const send = renderPrompt(action, {
      selection: JSON.stringify(selectionFocus ?? "the current rotation"),
    });

    if (action === "fix") {
      void runStructured("rotation", send, content.premadeFix.value);

      return;
    }

    const display = {
      audit: content.premadeAudit.value,
      critique: content.premadeCritique.value,
      explain: content.premadeExplain.value,
    }[action];

    void chat.sendChat(display, ctx.buildContextMarkdown(), send);
  });

  useEffect(() => {
    if (isOpen && intent === "fix") {
      consumeIntent();
      runPremade("fix");
    }
  }, [consumeIntent, intent, isOpen, runPremade]);

  const onSend = () => {
    const value = input.trim();

    if (!value || chat.busy) {
      return;
    }

    setInput("");

    if (mode === "chat") {
      void chat.sendChat(value, ctx.buildContextMarkdown());

      return;
    }

    if (mode === "simc") {
      void runStructured("rotation", value, content.capabilityImportSimc.value);
    } else if (mode === "list") {
      void runStructured("list", value, value, activeList);
    } else {
      void runStructured("rotation", value, value);
    }

    setMode("chat");
  };

  const applyCandidate = (id: number, candidate: Candidate) => {
    if (candidate.kind === "rotation") {
      replaceScript(candidate.object);
    } else if (candidate.kind === "list") {
      updateList(
        candidate.targetList ?? activeList,
        addActionIds(candidate.object),
      );
    }

    chat.markApplied(id);
  };

  return (
    <AssistantPanelContent
      activeList={activeList}
      chat={chat}
      hasValidationErrors={validation.status === "errors"}
      input={input}
      isOpen={isOpen}
      mode={mode}
      onApply={applyCandidate}
      onClose={close}
      onPremadePrompt={runPremade}
      onSend={onSend}
      resizeHandleProps={resizeHandleProps}
      setInput={setInput}
      setMode={setMode}
      transcript={transcript}
      width={width}
    />
  );
}
