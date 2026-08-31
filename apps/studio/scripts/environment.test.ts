import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { ENV_VARS } from "@wowlab/shared/lib/env";

const environmentFiles = [".env.cloudflare", ".env.cloudflare.dev"];
const expectedKeys = Object.values(ENV_VARS).sort((a, b) => a.localeCompare(b));

describe("Cloudflare environment", () => {
  it.each(environmentFiles)("defines every public variable in %s", (file) => {
    const contents = readFileSync(
      resolve(import.meta.dirname, "..", file),
      "utf8",
    );
    const keys = contents
      .split("\n")
      .filter((line) => line.startsWith("NEXT_PUBLIC_"))
      .map((line) => line.slice(0, line.indexOf("=")))
      .sort((a, b) => a.localeCompare(b));

    expect(keys).toEqual(expectedKeys);
  });
});
