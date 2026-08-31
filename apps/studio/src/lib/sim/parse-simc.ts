import type { Profile } from "wowlab-common";

import { extractSpecIdFromLoadout, parseSimcProfile } from "@/lib/wasm/api";

export type ParseSimcError =
  | { type: "cannotDetectSpec" }
  | { message?: string; type: "parseFailed" }
  | { specId: number; type: "specNotSupported" };

export type ParseSimcResult =
  | { error: ParseSimcError; ok: false; profile: Profile | null }
  | { ok: true; profile: Profile; specId: number };

type CommonModule = Parameters<typeof parseSimcProfile>[0];

// Pure: the caller owns the debounce and translates the returned error kind into its own i18n copy.
export function parseAndValidateSimc(
  common: CommonModule,
  implementedSpecIds: Set<number>,
  input: string,
): ParseSimcResult {
  let parsed: Profile;

  try {
    parsed = parseSimcProfile(common, input);
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : undefined,
        type: "parseFailed",
      },
      ok: false,
      profile: null,
    };
  }

  const specId = extractSpecIdFromLoadout(common, parsed.talents.encoded);

  if (!specId) {
    return { error: { type: "cannotDetectSpec" }, ok: false, profile: parsed };
  }

  if (!implementedSpecIds.has(specId)) {
    return {
      error: { specId, type: "specNotSupported" },
      ok: false,
      profile: parsed,
    };
  }

  return { ok: true, profile: parsed, specId };
}
