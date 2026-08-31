import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";
import { parse } from "stacktrace-parser";

export interface ExceptionIdentity {
  message: string;
  name: string;
  source?: string;
  stack?: string;
}

const HASH_WIDTH = 16;

// prettier-ignore
const DYNAMIC_VALUE_RULES = [
  { pattern: /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/giu, replacement: "<uuid>" },
  { pattern: /\b(?:0x)?[0-9a-f]{16,}\b/giu, replacement: "<hex-id>" },
  { pattern: /\b[A-Za-z\d_-]{24,}\b/gu, replacement: "<opaque-id>" },
  { pattern: /\b\d{4,}\b/gu, replacement: "<large-number>" },
] as const;

export function fingerprintException(identity: ExceptionIdentity): string {
  return hashIdentity(exceptionIdentity(identity));
}

function exceptionIdentity({
  message,
  name,
  source = "unknown",
  stack = "",
}: ExceptionIdentity): string {
  return [name, source, message, stackIdentity(stack)]
    .map((value) => normalizeDynamicValues(value))
    .join("\n");
}

function fileWithoutQuery(file: string | null): string {
  if (!file) {
    return "unknown";
  }

  const query = file.indexOf("?");
  const fragment = file.indexOf("#");
  const end = [query, fragment]
    .filter((index) => index >= 0)
    .reduce((minimum, index) => Math.min(minimum, index), file.length);

  return file.slice(0, end);
}

function hashIdentity(identity: string): string {
  return bytesToHex(sha256(utf8ToBytes(identity))).slice(0, HASH_WIDTH);
}

function normalizeDynamicValues(value: string): string {
  return DYNAMIC_VALUE_RULES.reduce(
    (normalized, { pattern, replacement }) =>
      normalized.replaceAll(pattern, replacement),
    value,
  );
}

function stackIdentity(stack: string): string {
  return parse(stack)
    .slice(0, 4)
    .map(({ file, methodName }) => `${methodName}@${fileWithoutQuery(file)}`)
    .join("\n");
}
