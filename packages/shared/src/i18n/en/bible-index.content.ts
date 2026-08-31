import { plural } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("bibleIndex", {
  // apps/studio/src/components/dev/bible/bible-index-page.tsx
  "readIntroduction": "Read the Introduction",
  "reference": "Reference",
  "summary": plural({ one: "{{sections}} section, {{articles}} articles", other: "{{sections}} sections, {{articles}} articles" }),
});
