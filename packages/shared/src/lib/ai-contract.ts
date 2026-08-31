// Must stay dependency-free: the Supabase `ai` edge function import-maps this exact source file in its deno.json.

export type AiProvider = "openai" | "anthropic" | "openrouter";

export const AI_PROVIDERS = [
  "openai",
  "anthropic",
  "openrouter",
] as const satisfies readonly AiProvider[];

export type AiGrammar = {
  descriptors: FieldDescriptorInfo[];
  spellSlugs: string[];
  auraSlugs: string[];
  resourceNames: string[];
};

export type AiModelOption = {
  id: string;
  label: string;
  provider: AiProvider;
  contextLength?: number;
  pricing?: { prompt?: string; completion?: string };
  inputModalities?: string[];
  description?: string;
};

export type AiObjectKind = "rotation" | "list" | "condition";

/** A `read` target in the rotation grammar; structural subset of the engine's `FieldDescriptorInfo`. */
export type FieldDescriptorInfo = {
  domain: string;
  name: string;
  field_type: string;
  description: string;
  key_domain?: string | null;
};

export type McpServerConfig = {
  id: string;
  label: string;
  url: string;
  headerName?: string;
  headerValue?: string;
};

export type ValidateKeyResponse = {
  valid: boolean;
  models?: AiModelOption[];
  credits?: number;
  error?: string;
};

export function isAiProvider(value: unknown): value is AiProvider {
  return (
    typeof value === "string" &&
    (AI_PROVIDERS as readonly string[]).includes(value)
  );
}
