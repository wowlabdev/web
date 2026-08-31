import type { AiModelOption, AiProvider } from "@wowlab/shared/lib/ai-contract";
import type { LanguageModel } from "ai";

import type { ProviderAdapter, ValidationResult } from "./shared.ts";

import { anthropic } from "./anthropic.ts";
import { openai } from "./openai.ts";
import { openrouter } from "./openrouter.ts";

const PROVIDERS: Record<AiProvider, ProviderAdapter> = {
  anthropic,
  openai,
  openrouter,
};

export async function listModels(
  provider: AiProvider,
  apiKey: string,
): Promise<AiModelOption[]> {
  try {
    return await PROVIDERS[provider].listModels(apiKey);
  } catch {
    return [];
  }
}

export function resolveModel(
  provider: AiProvider,
  model: string,
  apiKey: string,
): LanguageModel {
  return PROVIDERS[provider].createModel(apiKey, model);
}

export async function validateKey(
  provider: AiProvider,
  apiKey: string,
): Promise<ValidationResult> {
  try {
    return await PROVIDERS[provider].validate(apiKey);
  } catch {
    return { valid: false };
  }
}
