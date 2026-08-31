import { insert } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("simulateQuick", {
  // apps/studio/src/components/core/simulate/quick/quick-sim-configure-step.tsx
  "equipmentTitle": "Equipment",
  "equippedItemsSubtitle": "currently worn",
  "equippedItemsTitle": "Equipped Items",
  "headerItem": "Item",
  "headerSlot": "Slot",
  "iterationsHint": "1,000 - 1,000,000",
  "iterationsLabel": "Iterations",
  "loadingRotations": "Loading rotations...",
  "noRotations": insert("No rotations available for {{spec}}."),
  "rotationLabel": "Rotation",
  "rotationPlaceholder": "Select a rotation",
  "runSimulation": "Run Simulation",
  "specFallback": "—",
  "specSubtitle": insert("{{name}} · Level {{level}}"),
  "specTitle": "Spec",
  "submitting": "Submitting...",
});
