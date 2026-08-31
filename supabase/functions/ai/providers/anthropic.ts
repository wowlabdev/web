import { createAnthropic } from "@ai-sdk/anthropic";

import type { ProviderAdapter } from "./shared.ts";

import { getRows, normalize, probe, str } from "./shared.ts";

export const anthropic: ProviderAdapter = {
  createModel: (apiKey, model) => createAnthropic({ apiKey })(model),
  listModels: async (apiKey) =>
    normalize(
      await getRows("https://api.anthropic.com/v1/models", {
        "anthropic-version": "2023-06-01",
        "x-api-key": apiKey,
      }),
      (raw) => ({
        id: String(raw.id ?? ""),
        label: str(raw.display_name) ?? String(raw.id ?? ""),
        provider: "anthropic",
      }),
    ),
  validate: async (apiKey) => {
    const models = await anthropic.listModels(apiKey);

    return models.length > 0
      ? { models, valid: true }
      : await probe("https://api.anthropic.com/v1/models", {
          "anthropic-version": "2023-06-01",
          "x-api-key": apiKey,
        });
  },
};
