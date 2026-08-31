import { insert } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("simulateQuick", {
  // apps/studio/src/components/core/simulate/quick/quick-sim-configure-step.tsx
  "equipmentTitle": "Équipement",
  "equippedItemsSubtitle": "actuellement portés",
  "equippedItemsTitle": "Objets équipés",
  "headerItem": "Objet",
  "headerSlot": "Emplacement",
  "iterationsHint": "1 000 - 1 000 000",
  "iterationsLabel": "Itérations",
  "loadingRotations": "Chargement des rotations...",
  "noRotations": insert("Aucune rotation disponible pour {{spec}}."),
  "rotationLabel": "Rotation",
  "rotationPlaceholder": "Choisir une rotation",
  "runSimulation": "Lancer la simulation",
  "specFallback": "—",
  "specSubtitle": insert("{{name}} · Niveau {{level}}"),
  "specTitle": "Spé",
  "submitting": "Envoi...",
});
