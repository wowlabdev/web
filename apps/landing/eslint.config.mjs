import { createConfig, presets } from "@wowlab/eslint-config";

export default createConfig({
  ignores: [
    ".intlayer/**",
    ".next/**",
    ".open-next/**",
    ".velite/**",
    ".wrangler/**",
    "build/**",
    "next-env.d.ts",
    "out/**",
    "styled-system/**",
  ],
  internalPatterns: ["^@/.*", "^@wowlab/.*"],
  overrides: [
    {
      files: ["src/i18n/**"],
      rules: { "@stylistic/quote-props": "off" },
    },
    {
      files: ["**/*.{ts,tsx,mts,cts}"],
      rules: {
        "@typescript-eslint/no-unnecessary-condition": "warn",
        "react-hooks/incompatible-library": "off",
      },
    },
    {
      files: ["**/*.{js,jsx,ts,tsx,mjs,mts,cjs,cts}"],
      settings: { next: { rootDir: import.meta.dirname } },
    },
  ],
  presets: [
    presets.next(),
    presets.react({
      tsconfigRootDir: import.meta.dirname,
      typeChecked: true,
      typescriptTypeChecked: false,
    }),
    presets.tanstackQuery(),
    presets.node(),
  ],
});
