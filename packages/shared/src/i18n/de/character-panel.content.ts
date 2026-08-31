import { plural } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("characterPanel", {
  // apps/studio/src/components/shared/character/character-panel.tsx, apps/studio/src/components/shared/character/spec-character-panel.tsx
  "averageItemLevel": "Durchschnittliches Gegenstandslevel",
  "emptyForSpec": "Für diese Spezialisierung ist noch kein Paperdoll gespeichert.",
  "itemsEquipped": plural({ one: "{{count}} Gegenstand angelegt", other: "{{count}} Gegenstände angelegt" }),
  "labelLevel": "Stufe:",
  "labelName": "Name:",
});
