import type { AiModelOption } from "@wowlab/shared/lib/ai-contract";
import type { LanguageModel } from "ai";

export const TIMEOUT_MS = 10_000;

export type ProviderAdapter = {
  createModel: (apiKey: string, model: string) => LanguageModel;
  listModels: (apiKey: string) => Promise<AiModelOption[]>;
  validate: (apiKey: string) => Promise<ValidationResult>;
};

export type Raw = Record<string, unknown>;

export type ValidationResult = {
  valid: boolean;
  models?: AiModelOption[];
  credits?: number;
};

export function isRaw(value: unknown): value is Raw {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const str = (v: unknown): string | undefined =>
  typeof v === "string" ? v : undefined;

export const num = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;

export async function getRows(
  url: string,
  headers: HeadersInit,
): Promise<Raw[]> {
  const res = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    return [];
  }

  const body: unknown = await res.json();

  return isRaw(body) && Array.isArray(body.data)
    ? body.data.filter((row): row is Raw => isRaw(row))
    : [];
}

export function normalize(
  rows: Raw[],
  map: (raw: Raw) => AiModelOption,
): AiModelOption[] {
  return rows
    .map((raw) => map(raw))
    .filter((m) => m.id.length > 0)
    .sort((a, b) => a.label.localeCompare(b.label));
}

export async function probe(
  url: string,
  headers: HeadersInit,
): Promise<ValidationResult> {
  const res = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  return { valid: res.ok };
}
