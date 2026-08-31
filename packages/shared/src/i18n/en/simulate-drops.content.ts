import { insert } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("simulateDrops", {
  // apps/studio/src/components/core/simulate/drops/drops-configure-step.tsx, apps/studio/src/components/core/simulate/drops/drops-sources-step.tsx
  "headerInstance": "Instance",
  "iterationsHint": "1,000 - 1,000,000",
  "iterationsLabel": "Iterations",
  "keyLevelHint": insert("+{{level}}"),
  "keyLevelLabel": "Mythic+ Key Level",
  "loadingRotations": "Loading rotations...",
  "lootCategoriesTitle": "Loot Categories",
  "noRotations": insert("No rotations available for {{spec}}."),
  "raidDifficultyLabel": "Raid Difficulty",
  "rotationLabel": "Rotation",
  "rotationPlaceholder": "Select a rotation",
  "runSimulation": "Run Simulation",
  "statCategoriesAvailable": insert("{{count}} available"),
  "statCategoriesTitle": "Categories",
  "statSourcesSubtitle": "instances chosen",
  "statSourcesTitle": "Sources Selected",
  "submitting": "Submitting...",
});
