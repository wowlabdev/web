import { plural } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("docsIndex", {
  // apps/studio/src/components/dev/docs/docs-index-page.tsx
  "articleCount": plural({ one: "{{count}} article", other: "{{count}} articles" }),
  "readIntroduction": "Read the Introduction",
  "reference": "Reference",
});
