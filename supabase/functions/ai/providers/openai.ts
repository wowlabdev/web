import { createOpenAI } from "@ai-sdk/openai";

import type { ProviderAdapter } from "./shared.ts";

import { getRows, normalize, probe } from "./shared.ts";

export const openai: ProviderAdapter = {
  createModel: (apiKey, model) => createOpenAI({ apiKey })(model),
  listModels: async (apiKey) =>
    normalize(
      await getRows("https://api.openai.com/v1/models", {
        Authorization: `Bearer ${apiKey}`,
      }),
      (raw) => ({
        id: String(raw.id ?? ""),
        label: String(raw.id ?? ""),
        provider: "openai",
      }),
    ),
  validate: async (apiKey) => {
    const models = await openai.listModels(apiKey);

    return models.length > 0
      ? { models, valid: true }
      : await probe("https://api.openai.com/v1/models", {
          Authorization: `Bearer ${apiKey}`,
        });
  },
};
