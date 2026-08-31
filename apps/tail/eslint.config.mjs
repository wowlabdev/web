import { createConfig, presets } from "@wowlab/eslint-config";

export default createConfig({
  ignores: ["dist/**", "dist-*/**"],
  presets: [
    presets.typescript({
      tsconfigRootDir: import.meta.dirname,
      typeChecked: true,
    }),
    presets.node(),
  ],
});
