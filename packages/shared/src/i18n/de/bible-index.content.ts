import { plural } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("bibleIndex", {
  // apps/studio/src/components/dev/bible/bible-index-page.tsx
  "readIntroduction": "Einführung lesen",
  "reference": "Referenz",
  "summary": plural({ one: "{{sections}} Bereich, {{articles}} Artikel", other: "{{sections}} Bereiche, {{articles}} Artikel" }),
});
