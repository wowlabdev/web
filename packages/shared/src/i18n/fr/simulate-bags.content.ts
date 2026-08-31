import { insert } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("simulateBags", {
  // apps/studio/src/components/core/simulate/bags/bags-configure-step.tsx, apps/studio/src/components/core/simulate/bags/block-combinations-dialog.tsx, apps/studio/src/components/core/simulate/bags/confirm-combinations-dialog.tsx
  "blockDialogBody": insert("{{count}} combinaisons, c'est plus que ce que je vais lancer. Reviens en arrière, réduis ta sélection, puis réessaie."),
  "blockDialogConfirm": "Compris",
  "blockDialogTitle": "Sélection trop large",
  "cancel": "Annuler",
  "confirmDialogBody": insert("Tu as choisi {{count}} combinaisons. Ça peut prendre un moment. Réduis ta sélection pour des résultats plus rapides."),
  "confirmDialogConfirm": "Lancer quand même",
  "confirmDialogTitle": "Ça fait beaucoup de combinaisons",
  "iterationsHint": "1 000 - 1 000 000",
  "iterationsLabel": "Itérations",
  "loadingRotations": "Chargement des rotations...",
  "noRotations": insert("Aucune rotation disponible pour {{spec}}."),
  "rotationLabel": "Rotation",
  "rotationPlaceholder": "Choisir une rotation",
  "simulateButton": "Simuler",
  "simulateCombinationsButton": "Simuler les combinaisons",
  "submitting": "Envoi",
});
