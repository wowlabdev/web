import { plural } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("docsIndex", {
  // apps/studio/src/components/dev/docs/docs-index-page.tsx
  "articleCount": plural({ one: "{{count}} Artikel", other: "{{count}} Artikel" }),
  "readIntroduction": "Einführung lesen",
  "reference": "Referenz",
});
