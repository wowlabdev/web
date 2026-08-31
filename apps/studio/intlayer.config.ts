import type { IntlayerConfig } from "intlayer";

import { DEFAULT_LOCALE, LOCALES } from "@wowlab/shared/lib/seo/locales";

const config: IntlayerConfig = {
  build: {
    optimize: false,
  },
  content: {
    contentDir: ["src", "../../packages/shared/src/i18n"],
  },
  dictionary: {
    importMode: "static",
  },
  internationalization: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [...LOCALES],
  },
  routing: {
    mode: "prefix-no-default",
    storage: "localStorage",
  },
};

export default config;
