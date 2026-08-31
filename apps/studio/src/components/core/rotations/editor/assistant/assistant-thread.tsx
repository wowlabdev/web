"use client";

import { useIntlayer } from "next-intlayer";
import { useNumber } from "next-intlayer/format";
import { useEffect, useRef } from "react";

import { CopyButton } from "@wowlab/shared/components/common/copy-button";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { ScrollArea } from "@wowlab/shared/components/ui/scroll-area";

import type {
  Candidate,
  ChatMetadata,
  ThreadEntry,
} from "./use-assistant-chat";

import { AiNotConfigured } from "./ai-not-configured";
import { AssistantMarkdown } from "./assistant-markdown";
import { CandidatePreview } from "./candidate-preview";
type AssistantThreadProps = {
  entries: ThreadEntry[];
  busy: boolean;
  onApply: (id: number, candidate: Candidate) => void;
  onDiscard: (id: number) => void;
};

export function AssistantThread({
  busy,
  entries,
  onApply,
  onDiscard,
}: Readonly<AssistantThreadProps>) {
  const content = useIntlayer("rotationAssistant");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [entries]);

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex flex-col gap-3 p-4">
        {entries.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {content.threadEmpty}
          </p>
        )}
        {entries.map((entry) => (
          <ThreadItem
            key={entry.id}
            entry={entry}
            onApply={onApply}
            onDiscard={onDiscard}
          />
        ))}
        {busy && <ResultSkeleton />}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

function MessageMeta({
  meta,
}: Readonly<{
  meta: ChatMetadata;
}>) {
  const content = useIntlayer("rotationAssistant");
  const fmtNumber = useNumber();
  const usage = meta.usage;
  const parts: string[] = [];
  const fmtTokens = (value: number | null | undefined) =>
    value == null ? "–" : fmtNumber(value);

  if (meta.model) {
    parts.push(meta.model);
  }

  if (usage && (usage.inputTokens != null || usage.outputTokens != null)) {
    parts.push(
      content.tokensUsage({
        input: fmtTokens(usage.inputTokens),
        output: fmtTokens(usage.outputTokens),
      }).value,
    );
  }

  if (meta.finishReason === "length") {
    parts.push(content.truncatedNote.value);
  }

  if (parts.length === 0) {
    return null;
  }

  return <p className="text-xs text-muted-foreground">{parts.join(" · ")}</p>;
}

function ResultSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

function ThreadItem({
  entry,
  onApply,
  onDiscard,
}: Readonly<{
  entry: ThreadEntry;
  onApply: (id: number, candidate: Candidate) => void;
  onDiscard: (id: number) => void;
}>) {
  const content = useIntlayer("rotationAssistant");

  if (entry.role === "user") {
    return (
      <div className="group flex items-start justify-end gap-1">
        <CopyButton
          value={entry.text}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        />
        <div className="max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
          {entry.text}
        </div>
      </div>
    );
  }

  if (entry.kind === "text") {
    if (!entry.text) {
      return <ResultSkeleton />;
    }

    return (
      <div className="group space-y-1">
        <AssistantMarkdown>{entry.text}</AssistantMarkdown>
        <div className="flex items-center justify-between gap-2">
          {entry.meta ? <MessageMeta meta={entry.meta} /> : <span />}
          <CopyButton
            value={entry.text}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          />
        </div>
      </div>
    );
  }

  if (entry.kind === "candidate") {
    return (
      <div className="rounded-lg border p-3">
        {entry.applied ? (
          <Badge variant="secondary">{content.appliedBadge}</Badge>
        ) : (
          <CandidatePreview
            candidate={entry.candidate}
            onApply={() => onApply(entry.id, entry.candidate)}
            onDiscard={() => onDiscard(entry.id)}
          />
        )}
      </div>
    );
  }

  if (entry.kind === "invalid") {
    return (
      <Alert variant="destructive">
        <AlertTitle>{content.invalidTitle}</AlertTitle>
        <AlertDescription>
          {content.invalidRemaining(entry.errors.length)}
        </AlertDescription>
      </Alert>
    );
  }

  return entry.reason === "not_configured" ? (
    <AiNotConfigured />
  ) : (
    <Alert variant="destructive">
      <AlertTitle>{content.errorTitle}</AlertTitle>
      <AlertDescription>{content.errorGeneration}</AlertDescription>
    </Alert>
  );
}
