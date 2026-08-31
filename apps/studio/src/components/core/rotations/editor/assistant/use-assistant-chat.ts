"use client";

import type { UIMessage, UIMessageChunk } from "ai";
import type { ValidationError } from "wowlab-engine";

import { readUIMessageStream } from "ai";
import { useCallback, useMemo, useRef, useState } from "react";

import { aiFetch } from "@/lib/ai/client";

import type { AiObjectReady } from "./use-ai-object";

export type Candidate = AiObjectReady;

export type ChatMetadata = {
  finishReason?: string;
  model?: string;
  usage?: { inputTokens?: number; outputTokens?: number; totalTokens?: number };
};

export type ThreadEntry =
  | { id: number; role: "user"; text: string }
  | {
      id: number;
      role: "assistant";
      kind: "text";
      text: string;
      pending: boolean;
      meta?: ChatMetadata;
    }
  | {
      id: number;
      role: "assistant";
      kind: "candidate";
      candidate: Candidate;
      applied: boolean;
    }
  | {
      id: number;
      role: "assistant";
      kind: "invalid";
      errors: ValidationError[];
    }
  | {
      id: number;
      role: "assistant";
      kind: "error";
      reason: "failed" | "not_configured";
    };

type ChatMessage = { role: "assistant" | "user"; content: string };

export function useAssistantChat() {
  const [entries, setEntries] = useState<ThreadEntry[]>([]);
  const entriesRef = useRef<ThreadEntry[]>([]);
  const idRef = useRef(0);
  const [busy, setBusy] = useState(false);

  const commit = useCallback((next: ThreadEntry[]) => {
    entriesRef.current = next;
    setEntries(next);
  }, []);

  const nextId = () => {
    idRef.current += 1;

    return idRef.current;
  };

  const reset = useCallback(() => {
    commit([]);
  }, [commit]);

  const pushUser = useCallback(
    (text: string) => {
      commit([...entriesRef.current, { id: nextId(), role: "user", text }]);
    },
    [commit],
  );

  const pushCandidate = useCallback(
    (candidate: Candidate) => {
      commit([
        ...entriesRef.current,
        {
          applied: false,
          candidate,
          id: nextId(),
          kind: "candidate",
          role: "assistant",
        },
      ]);
    },
    [commit],
  );

  const pushInvalid = useCallback(
    (errors: ValidationError[]) => {
      commit([
        ...entriesRef.current,
        { errors, id: nextId(), kind: "invalid", role: "assistant" },
      ]);
    },
    [commit],
  );

  const pushError = useCallback(
    (reason: "failed" | "not_configured") => {
      commit([
        ...entriesRef.current,
        { id: nextId(), kind: "error", reason, role: "assistant" },
      ]);
    },
    [commit],
  );

  const markApplied = useCallback(
    (id: number) => {
      commit(
        entriesRef.current.map((e) =>
          e.id === id && e.role === "assistant" && e.kind === "candidate"
            ? { ...e, applied: true }
            : e,
        ),
      );
    },
    [commit],
  );

  const sendChat = useCallback(
    async (display: string, contextMarkdown: string, send?: string) => {
      const history: ChatMessage[] = [];

      for (const e of entriesRef.current) {
        if (e.role === "user") {
          history.push({ content: e.text, role: "user" });
        } else if (e.kind === "text" && e.text) {
          history.push({ content: e.text, role: "assistant" });
        }
      }

      const userId = nextId();
      const assistantId = nextId();

      commit([
        ...entriesRef.current,
        { id: userId, role: "user", text: display },
        {
          id: assistantId,
          kind: "text",
          pending: true,
          role: "assistant",
          text: "",
        },
      ]);

      const messages: ChatMessage[] = [
        ...history,
        { content: send ?? display, role: "user" },
      ];

      setBusy(true);

      const finalize = (
        patch: Partial<Extract<ThreadEntry, { kind: "text" }>>,
      ) => {
        commit(
          entriesRef.current.map((e) =>
            e.id === assistantId && e.role === "assistant" && e.kind === "text"
              ? { ...e, ...patch }
              : e,
          ),
        );
      };

      const replaceWithError = (reason: "failed" | "not_configured") => {
        commit(
          entriesRef.current.map((e) =>
            e.id === assistantId
              ? { id: assistantId, kind: "error", reason, role: "assistant" }
              : e,
          ),
        );
      };

      try {
        const res = await aiFetch("chat", { contextMarkdown, messages });

        if (res.status === 409) {
          replaceWithError("not_configured");

          return;
        }

        if (!res.ok || !res.body) {
          replaceWithError("failed");

          return;
        }

        let text = "";
        let meta: ChatMetadata | undefined;

        for await (const message of readUIMessageStream({
          stream: sseToUiChunks(res.body),
        })) {
          text = textOf(message);
          meta = message.metadata as ChatMetadata | undefined;
          finalize({ text });
        }

        finalize({ meta, pending: false, text });
      } catch {
        replaceWithError("failed");
      } finally {
        setBusy(false);
      }
    },
    [commit],
  );

  // Every turn re-bills its full input context, so session cost is the sum of per-turn usage.
  const usageTotal = useMemo(() => {
    let inputTokens = 0;
    let outputTokens = 0;

    for (const entry of entries) {
      if (
        entry.role === "assistant" &&
        entry.kind === "text" &&
        entry.meta?.usage
      ) {
        inputTokens += entry.meta.usage.inputTokens ?? 0;
        outputTokens += entry.meta.usage.outputTokens ?? 0;
      }
    }

    return { inputTokens, outputTokens };
  }, [entries]);

  return {
    busy,
    entries,
    markApplied,
    pushCandidate,
    pushError,
    pushInvalid,
    pushUser,
    reset,
    sendChat,
    setBusy,
    usageTotal,
  };
}

// POST responses can't use EventSource, so read the SSE `data:` frames into the chunk stream ourselves.
function sseToUiChunks(
  body: ReadableStream<Uint8Array>,
): ReadableStream<UIMessageChunk> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return new ReadableStream<UIMessageChunk>({
    async start(controller) {
      try {
        for (;;) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split("\n\n");

          buffer = frames.pop() ?? "";

          for (const frame of frames) {
            const payload = frame
              .split("\n")
              .filter((line) => line.startsWith("data:"))
              .map((line) => line.slice(5).trim())
              .join("");

            if (payload && payload !== "[DONE]") {
              controller.enqueue(JSON.parse(payload) as UIMessageChunk);
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });
}

function textOf(message: UIMessage): string {
  let text = "";

  for (const part of message.parts) {
    if (part.type === "text") {
      text += part.text;
    }
  }

  return text;
}
