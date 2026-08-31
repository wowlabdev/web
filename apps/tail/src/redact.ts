import type { RedactOptions } from "flare-redact";

import { redact } from "flare-redact";
import { redactUrl } from "flare-redact/http";
import { parse } from "stacktrace-parser";

const MAX_STACK_FRAMES = 4;
const UNKNOWN_SOURCE = "unknown";
const REDACTION_OPTIONS = {
  enable: ["high_entropy", "ipv4", "pii"],
  mode: "label",
} as const satisfies RedactOptions;

export function redactExceptionStack(stack: string): string {
  return parse(stack)
    .slice(0, MAX_STACK_FRAMES)
    .map((frame) => formatFrame(frame))
    .join("\n");
}

export function redactSensitiveText(value: string): string {
  return redact(value, REDACTION_OPTIONS);
}

function formatFrame({
  column,
  file,
  lineNumber,
  methodName,
}: ReturnType<typeof parse>[number]): string {
  const location = [lineNumber, column].filter(Boolean).join(":");
  const suffix = location ? `:${location}` : "";

  return `${redactSensitiveText(methodName)}@${sourcePath(file)}${suffix}`;
}

function sourcePath(file: string | null): string {
  if (!file) {
    return UNKNOWN_SOURCE;
  }

  if (URL.canParse(file)) {
    const redacted = new URL(redactUrl(file, REDACTION_OPTIONS));

    return decodeURIComponent(redacted.pathname);
  }

  return redactSensitiveText(file);
}
