import { insert } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("simulateBags", {
  // apps/studio/src/components/core/simulate/bags/bags-configure-step.tsx, apps/studio/src/components/core/simulate/bags/block-combinations-dialog.tsx, apps/studio/src/components/core/simulate/bags/confirm-combinations-dialog.tsx
  "blockDialogBody": insert("{{count}} combinations is past what I will run. Go back and narrow your selection, then try again."),
  "blockDialogConfirm": "Got it",
  "blockDialogTitle": "Selection is too large",
  "cancel": "Cancel",
  "confirmDialogBody": insert("You picked {{count}} combinations. This could take a while to run. Narrow your selection for faster results."),
  "confirmDialogConfirm": "Run anyway",
  "confirmDialogTitle": "That is a lot of combinations",
  "iterationsHint": "1,000 - 1,000,000",
  "iterationsLabel": "Iterations",
  "loadingRotations": "Loading rotations...",
  "noRotations": insert("No rotations available for {{spec}}."),
  "rotationLabel": "Rotation",
  "rotationPlaceholder": "Select a rotation",
  "simulateButton": "Simulate",
  "simulateCombinationsButton": "Simulate Combinations",
  "submitting": "Submitting",
});
