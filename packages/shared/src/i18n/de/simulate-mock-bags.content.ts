import { insert, plural } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("simulateMockBags", {
  // apps/studio/src/components/core/simulate/mock-bags/configure-step.tsx, apps/studio/src/components/core/simulate/mock-bags/inventory-sim-stats.tsx, apps/studio/src/components/core/simulate/mock-bags/inventory-sim-toolbar.tsx +3 more
  "cancel": "Abbrechen",
  "done": "Fertig",
  "equippedBadge": "A",
  "itemsCount": plural({ one: "{{count}} Gegenstand", other: "{{count}} Gegenstände" }),
  "rotationLabel": "Rotation",
  "rotationUsingDefault": insert("Verwende Standard-Rotation für {{spec}} (Mock)"),
  "rotationUsingDefaultFallback": "Verwende Standard-Spec-Rotation (Mock)",
  "simulationLabel": "Simulation",
  "simulationSummary": insert("{{permutations}} Permutationen über {{chunks}} progressive Blöcke"),
  "sparkBestConverging": "Beste Permutation (konvergiert)",
  "sparkBestFinal": "Finale beste Permutation",
  "sparkTicker": "DPS",
  "startSimulation": "Simulation starten",
  "statBestDpsConverging": "konvergiert",
  "statBestDpsFinal": "final",
  "statBestDpsTitle": "Beste DPS",
  "statPermutationsTitle": "Permutationen",
  "statPermutationsTrend": insert("{{count}} Slots"),
  "statSimmedTitle": "Simuliert",
  "statSimmedTrend": insert("Block {{chunk}}/{{total}}"),
  "statSimsPerSecActive": "aktiv",
  "statSimsPerSecDone": "fertig",
  "statSimsPerSecTitle": "Sims/Sek",
  "swapsCount": plural({ one: "{{count}} Wechsel", other: "{{count}} Wechsel" }),
  "toolbarReset": "Zurücksetzen",
  "weeklyBadge": "W",
});
