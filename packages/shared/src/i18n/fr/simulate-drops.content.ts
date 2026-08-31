import { insert } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("simulateDrops", {
  // apps/studio/src/components/core/simulate/drops/drops-configure-step.tsx, apps/studio/src/components/core/simulate/drops/drops-sources-step.tsx
  "headerInstance": "Instance",
  "iterationsHint": "1 000 - 1 000 000",
  "iterationsLabel": "Itérations",
  "keyLevelHint": insert("+{{level}}"),
  "keyLevelLabel": "Niveau de clé Mythique+",
  "loadingRotations": "Chargement des rotations...",
  "lootCategoriesTitle": "Catégories de butin",
  "noRotations": insert("Aucune rotation disponible pour {{spec}}."),
  "raidDifficultyLabel": "Difficulté de raid",
  "rotationLabel": "Rotation",
  "rotationPlaceholder": "Choisir une rotation",
  "runSimulation": "Lancer la simulation",
  "statCategoriesAvailable": insert("{{count}} disponibles"),
  "statCategoriesTitle": "Catégories",
  "statSourcesSubtitle": "instances choisies",
  "statSourcesTitle": "Sources sélectionnées",
  "submitting": "Envoi...",
});
