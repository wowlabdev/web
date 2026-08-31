import { insert, plural } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("simulateMockBags", {
  // apps/studio/src/components/core/simulate/mock-bags/configure-step.tsx, apps/studio/src/components/core/simulate/mock-bags/inventory-sim-stats.tsx, apps/studio/src/components/core/simulate/mock-bags/inventory-sim-toolbar.tsx +3 more
  "cancel": "Cancel",
  "done": "Done",
  "equippedBadge": "E",
  "itemsCount": plural({ one: "{{count}} item", other: "{{count}} items" }),
  "rotationLabel": "Rotation",
  "rotationUsingDefault": insert("Using default {{spec}} rotation (mock)"),
  "rotationUsingDefaultFallback": "Using default spec rotation (mock)",
  "simulationLabel": "Simulation",
  "simulationSummary": insert("{{permutations}} permutations across {{chunks}} progressive chunks"),
  "sparkBestConverging": "Best permutation (converging)",
  "sparkBestFinal": "Final best permutation",
  "sparkTicker": "DPS",
  "startSimulation": "Start Simulation",
  "statBestDpsConverging": "converging",
  "statBestDpsFinal": "final",
  "statBestDpsTitle": "Best DPS",
  "statPermutationsTitle": "Permutations",
  "statPermutationsTrend": insert("{{count}} slots"),
  "statSimmedTitle": "Simmed",
  "statSimmedTrend": insert("chunk {{chunk}}/{{total}}"),
  "statSimsPerSecActive": "active",
  "statSimsPerSecDone": "done",
  "statSimsPerSecTitle": "Sims/sec",
  "swapsCount": plural({ one: "{{count}} swap", other: "{{count}} swaps" }),
  "toolbarReset": "Reset",
  "weeklyBadge": "W",
});
