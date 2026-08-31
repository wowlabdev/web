import { plural } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("characterPanel", {
  // apps/studio/src/components/shared/character/character-panel.tsx, apps/studio/src/components/shared/character/spec-character-panel.tsx
  "averageItemLevel": "Niveau d'objet moyen",
  "emptyForSpec": "Aucun paperdoll enregistré pour cette spé pour le moment.",
  "itemsEquipped": plural({ one: "{{count}} objet équipé", other: "{{count}} objets équipés" }),
  "labelLevel": "Niveau :",
  "labelName": "Nom :",
});
