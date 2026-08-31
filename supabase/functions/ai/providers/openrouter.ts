import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import type { ProviderAdapter } from "./shared.ts";

import { getRows, isRaw, normalize, num, str, TIMEOUT_MS } from "./shared.ts";

export const openrouter: ProviderAdapter = {
  createModel: (apiKey, model) =>
    createOpenRouter({
      apiKey,
      compatibility: "strict",
      headers: { "X-Title": "WoW Lab" },
      // OpenRouter omits usage from streamed responses unless explicitly requested.
    }).chat(model, { usage: { include: true } }),
  listModels: async () =>
    normalize(
      await getRows("https://openrouter.ai/api/v1/models", {
        Accept: "application/json",
      }),
      (raw) => {
        const arch = isRaw(raw.architecture) ? raw.architecture : {};
        const pricing = isRaw(raw.pricing) ? raw.pricing : {};

        return {
          contextLength: num(raw.context_length),
          description: str(raw.description),
          id: String(raw.id ?? ""),
          inputModalities: Array.isArray(arch.input_modalities)
            ? arch.input_modalities.filter(
                (modality): modality is string => typeof modality === "string",
              )
            : undefined,
          label: str(raw.name) ?? String(raw.id ?? ""),
          pricing: {
            completion: str(pricing.completion),
            prompt: str(pricing.prompt),
          },
          provider: "openrouter",
        };
      },
    ),
  validate: async (apiKey) => {
    const keyRes = await fetch("https://openrouter.ai/api/v1/key", {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!keyRes.ok) {
      return { valid: false };
    }

    const body: unknown = await keyRes.json();
    const data = isRaw(body) && isRaw(body.data) ? body.data : undefined;

    return {
      credits: num(data?.limit_remaining),
      models: await openrouter.listModels(apiKey),
      valid: true,
    };
  },
};
