import { plural } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("bibleIndex", {
  // apps/studio/src/components/dev/bible/bible-index-page.tsx
  "readIntroduction": "Lire l'introduction",
  "reference": "Référence",
  "summary": plural({ one: "{{sections}} section, {{articles}} articles", other: "{{sections}} sections, {{articles}} articles" }),
});
