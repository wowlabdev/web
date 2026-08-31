import { createConfig, presets } from "@wowlab/eslint-config";

export default createConfig({
  ignores: ["**/dist-*/**"],
  overrides: [
    {
      files: ["apps/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
      name: "wowlab/package-boundaries",
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["**/packages/shared/**"],
                message:
                  "Import shared code through an @wowlab/shared package export.",
              },
            ],
          },
        ],
      },
    },
  ],
  presets: [
    presets.node(),
    presets.typescript({ tsconfigRootDir: import.meta.dirname }),
  ],
});
