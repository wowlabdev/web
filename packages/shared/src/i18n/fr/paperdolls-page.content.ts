import { plural } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("paperdollsPage", {
  // apps/studio/src/components/dev/paperdolls-page.tsx
  "averageItemLevel": "Niveau d'objet moyen",
  "empty": "Aucun paperdoll enregistré pour le moment.",
  "emptyForSpec": "Aucun paperdoll enregistré pour cette spé pour le moment.",
  "itemsEquipped": plural({ one: "{{count}} objet équipé", other: "{{count}} objets équipés" }),
});
