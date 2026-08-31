import type { z } from "zod";

export function parse<T>(schema: z.ZodType<T>, value: unknown): T | null;
export function parse<T>(schema: z.ZodType<T>, value: unknown, fallback: T): T;
export function parse<T>(schema: z.ZodType<T>, value: unknown, fallback?: T) {
  const result = schema.safeParse(value);

  return result.success ? result.data : (fallback ?? null);
}

export function tryParseJson(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}
