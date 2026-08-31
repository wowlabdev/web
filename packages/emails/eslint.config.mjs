import { createConfig, presets } from "@wowlab/eslint-config";

export default createConfig({
  ignores: [".react-email/**", "out/**"],
  presets: [
    presets.react({
      tsconfigRootDir: import.meta.dirname,
      typeChecked: true,
    }),
    presets.node(),
  ],
});
