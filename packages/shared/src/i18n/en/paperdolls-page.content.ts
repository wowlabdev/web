import { plural } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("paperdollsPage", {
  // apps/studio/src/components/dev/paperdolls-page.tsx
  "averageItemLevel": "Average item level",
  "empty": "No paperdolls saved yet.",
  "emptyForSpec": "No paperdoll saved for this spec yet.",
  "itemsEquipped": plural({ one: "{{count}} item equipped", other: "{{count}} items equipped" }),
});
