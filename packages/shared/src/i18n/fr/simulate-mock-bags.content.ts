import { insert, plural } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("simulateMockBags", {
  // apps/studio/src/components/core/simulate/mock-bags/configure-step.tsx, apps/studio/src/components/core/simulate/mock-bags/inventory-sim-stats.tsx, apps/studio/src/components/core/simulate/mock-bags/inventory-sim-toolbar.tsx +3 more
  "cancel": "Annuler",
  "done": "Terminé",
  "equippedBadge": "É",
  "itemsCount": plural({ one: "{{count}} objet", other: "{{count}} objets" }),
  "rotationLabel": "Rotation",
  "rotationUsingDefault": insert("Rotation {{spec}} par défaut (factice)"),
  "rotationUsingDefaultFallback": "Rotation par défaut de la spé (factice)",
  "simulationLabel": "Simulation",
  "simulationSummary": insert("{{permutations}} permutations sur {{chunks}} blocs progressifs"),
  "sparkBestConverging": "Meilleure permutation (en convergence)",
  "sparkBestFinal": "Meilleure permutation finale",
  "sparkTicker": "DPS",
  "startSimulation": "Lancer la simulation",
  "statBestDpsConverging": "en convergence",
  "statBestDpsFinal": "final",
  "statBestDpsTitle": "Meilleur DPS",
  "statPermutationsTitle": "Permutations",
  "statPermutationsTrend": insert("{{count}} emplacements"),
  "statSimmedTitle": "Simulés",
  "statSimmedTrend": insert("bloc {{chunk}}/{{total}}"),
  "statSimsPerSecActive": "actif",
  "statSimsPerSecDone": "terminé",
  "statSimsPerSecTitle": "Sims/sec",
  "swapsCount": plural({ one: "{{count}} échange", other: "{{count}} échanges" }),
  "toolbarReset": "Réinitialiser",
  "weeklyBadge": "H",
});
