import { plural } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("docsIndex", {
  // apps/studio/src/components/dev/docs/docs-index-page.tsx
  "articleCount": plural({ one: "{{count}} article", other: "{{count}} articles" }),
  "readIntroduction": "Lire l'introduction",
  "reference": "Référence",
});
