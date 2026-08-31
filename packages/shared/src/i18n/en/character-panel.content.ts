import { plural } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("characterPanel", {
  // apps/studio/src/components/shared/character/character-panel.tsx, apps/studio/src/components/shared/character/spec-character-panel.tsx
  "averageItemLevel": "Average item level",
  "emptyForSpec": "No paperdoll saved for this spec yet.",
  "itemsEquipped": plural({ one: "{{count}} item equipped", other: "{{count}} items equipped" }),
  "labelLevel": "Level:",
  "labelName": "Name:",
});
