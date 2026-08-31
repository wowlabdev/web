import { createConfig, presets } from "@wowlab/eslint-config";

export default createConfig({
  ignores: ["**/*.json", "**/*.md", "**/deno.lock"],
  overrides: [
    {
      files: ["**/*.{cts,mts,ts,tsx}"],
      languageOptions: {
        parserOptions: {
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
    {
      files: ["**/*.test.ts"],
      rules: { "sonarjs/no-empty-test-file": "off" },
    },
  ],
  presets: [presets.typescript(), presets.deno()],
});
