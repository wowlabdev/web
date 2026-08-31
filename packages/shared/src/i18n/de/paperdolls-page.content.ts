import { plural } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("paperdollsPage", {
  // apps/studio/src/components/dev/paperdolls-page.tsx
  "averageItemLevel": "Durchschnittliches Gegenstandslevel",
  "empty": "Noch keine Paperdolls gespeichert.",
  "emptyForSpec": "Für diese Spezialisierung ist noch kein Paperdoll gespeichert.",
  "itemsEquipped": plural({ one: "{{count}} Gegenstand angelegt", other: "{{count}} Gegenstände angelegt" }),
});
