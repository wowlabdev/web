import { createConfig, presets } from "@wowlab/eslint-config";

export default createConfig({
  ignores: ["dist/**", "dist-*/**"],
  presets: [
    presets.react({
      tsconfigRootDir: import.meta.dirname,
      typeChecked: true,
    }),
  ],
});
