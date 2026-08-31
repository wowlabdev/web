import { serializeError } from "serialize-error";

import { fingerprintException } from "@wowlab/shared/lib/observability/fingerprint";

import { log } from "./log";

interface ErrorDetails {
  message: string;
  name: string;
  stack?: string;
}

export function captureError(
  error: unknown,
  source: string,
  message: string,
  context?: Record<string, unknown>,
): void {
  const details = errorDetails(error);

  log
    .withMetadata({
      ...context,
      errorFingerprint: fingerprintException({ ...details, source }),
      errorMessage: details.message,
      errorName: details.name,
      eventType: "exception",
      source,
    })
    .withError(error)
    .error(message);
}

function errorDetails(error: unknown): ErrorDetails {
  const serialized = serializeError(error, { maxDepth: 2 });

  return {
    message: serialized.message ?? String(error),
    name: serialized.name ?? "Error",
    stack: serialized.stack,
  };
}
