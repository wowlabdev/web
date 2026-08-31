import type { Database } from "@wowlab/shared/lib/supabase/database.types";
import type { Row } from "@wowlab/shared/lib/supabase/types";

export type PublicFunctions = Database["public"]["Functions"];

export type RpcArgs<Name extends keyof PublicFunctions> =
  PublicFunctions[Name]["Args"];

export type RpcReturns<Name extends keyof PublicFunctions> =
  PublicFunctions[Name]["Returns"];

export type TableRow<Name extends keyof Database["public"]["Tables"]> =
  Row<Name>;

export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
  fallbackMessage: string | ((response: Response) => string) = "request failed",
): Promise<T> {
  const res = await fetch(url, init);

  if (!res.ok) {
    const detail: unknown = await res.json().catch(() => ({}));

    const fallback =
      typeof fallbackMessage === "function"
        ? fallbackMessage(res)
        : fallbackMessage;

    throw new Error(readError(detail) ?? fallback);
  }

  return (await res.json()) as T;
}

export function throwIfError(error: { message: string } | null | undefined) {
  if (error) {
    throw error;
  }
}

function readError(value: unknown): string | undefined {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "string"
  ) {
    return value.error;
  }

  return undefined;
}
