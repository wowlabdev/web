import { describe, expect, it } from "vitest";

import { parsePublicEnvironment, wranglerVariables } from "./environment.ts";

describe("public environment", () => {
  it("parses public variables", () => {
    expect(
      parsePublicEnvironment("NEXT_PUBLIC_APP_URL=https://app.wowlab.gg"),
    ).toEqual({ NEXT_PUBLIC_APP_URL: "https://app.wowlab.gg" });
  });

  it("rejects server variables", () => {
    expect(() => parsePublicEnvironment("API_TOKEN=secret")).toThrow(
      "contains non-public variable API_TOKEN",
    );
  });

  it("rejects values OpenNext cannot pass through safely", () => {
    expect(() => parsePublicEnvironment('NEXT_PUBLIC_NAME="WoW Lab"')).toThrow(
      "contains an unsupported value for NEXT_PUBLIC_NAME",
    );
  });
});

describe("Wrangler variables", () => {
  it("converts an environment into explicit bindings", () => {
    expect(
      wranglerVariables({
        NEXT_PUBLIC_APP_URL: "https://app.dev.wowlab.gg",
        NEXT_PUBLIC_PADDLE_ENV: "sandbox",
      }),
    ).toEqual([
      "--var",
      "NEXT_PUBLIC_APP_URL:https://app.dev.wowlab.gg",
      "--var",
      "NEXT_PUBLIC_PADDLE_ENV:sandbox",
    ]);
  });
});
