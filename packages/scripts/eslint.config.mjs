import { createConfig, presets } from "@wowlab/eslint-config";

export default createConfig({
  presets: [
    presets.typescript({
      tsconfigRootDir: import.meta.dirname,
      typeChecked: true,
    }),
    presets.node(),
  ],
});
