import type { useAssistantChat } from "./use-assistant-chat";

type AssistantEntry = ReturnType<typeof useAssistantChat>["entries"][number];

export function buildAssistantTranscript(
  entries: AssistantEntry[],
  labels: { assistant: string; user: string },
): string {
  return entries
    .flatMap((entry) => {
      if (entry.role === "user") {
        return [`${labels.user}: ${entry.text}`];
      }

      if (entry.kind === "text" && entry.text) {
        return [`${labels.assistant}: ${entry.text}`];
      }

      return [];
    })
    .join("\n\n");
}
