import { fingerprintException } from "@wowlab/shared/lib/observability/fingerprint";

import type { ExceptionRecord } from "#types";

type StructuredException = Record<string, unknown>;

const UNKNOWN = "unknown";

export function collectExceptions(item: TraceItem): ExceptionRecord[] {
  const records: ExceptionRecord[] = [];
  const fingerprints = new Set<string>();

  for (const log of item.logs) {
    const values = Array.isArray(log.message) ? log.message : [log.message];

    for (const value of values) {
      const structured = structuredException(log.level, value);

      if (!structured) {
        continue;
      }

      const current = fromLog(item, structured);

      records.push(current);
      fingerprints.add(current.fingerprint);
    }
  }

  for (const exception of item.exceptions) {
    const current = record(item, exception);

    if (!fingerprints.has(current.fingerprint)) {
      records.push(current);
    }
  }

  return records;
}

function fromLog(item: TraceItem, value: StructuredException): ExceptionRecord {
  const error = isRecord(value.err) ? value.err : {};

  return record(item, {
    fingerprint: stringValue(value.errorFingerprint) || undefined,
    message:
      stringValue(value.errorMessage) ||
      stringValue(error.message) ||
      stringValue(value.message, "Unknown error"),
    name: stringValue(value.errorName) || stringValue(error.name, "Error"),
    source: stringValue(value.source, "handled"),
    stack: stringValue(error.stack),
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSerializedError(value: unknown): value is Record<string, unknown> {
  return (
    isRecord(value) &&
    typeof value.message === "string" &&
    typeof value.name === "string"
  );
}

function record(
  item: TraceItem,
  details: {
    fingerprint?: string;
    message: string;
    name: string;
    source?: string;
    stack?: string;
  },
): ExceptionRecord {
  const source = details.source ?? "uncaught";

  return {
    fingerprint:
      details.fingerprint ?? fingerprintException({ ...details, source }),
    message: details.message,
    name: details.name,
    outcome: item.outcome,
    route: route(item),
    script: item.scriptName ?? UNKNOWN,
    source,
    stack: details.stack ?? "",
    version: version(item),
  };
}

function route(item: TraceItem): string {
  if (!item.event || !("request" in item.event)) {
    return "-";
  }

  try {
    return new URL(item.event.request.url).pathname;
  } catch {
    return "-";
  }
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function structuredException(
  level: string,
  value: unknown,
): StructuredException | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  if (value.eventType === "exception") {
    return value;
  }

  return level === "error" && isSerializedError(value.err) ? value : undefined;
}

function version(item: TraceItem): string {
  return (
    item.scriptVersion?.tag ??
    item.scriptVersion?.id ??
    item.scriptVersion?.message ??
    UNKNOWN
  );
}
