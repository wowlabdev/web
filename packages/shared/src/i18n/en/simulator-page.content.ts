import { insert, plural } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("simulatorPage", {
  // apps/studio/src/components/core/simulator/engine-skeleton.tsx, apps/studio/src/components/core/simulator/settings/setting-field.tsx, apps/studio/src/components/core/simulator/settings/settings-panel.tsx +7 more
  "assignedChunks": "Assigned Chunks",
  "benchmark": "Benchmark",
  "cannotDetectSpec": "Could not detect spec from talent string.",
  "chunksReceived": plural({ one: "{{count}} chunk received", other: "{{count}} chunks received" }),
  "clearAllJobs": "Clear All Jobs",
  "clearing": "Clearing...",
  "confirmDeleteAllJobs": "Delete ALL jobs? This cannot be undone.",
  "failedToClearJobs": "Failed to clear jobs.",
  "failedToParseProfile": "Failed to parse profile.",
  "failedToSubmitJob": "Failed to submit job.",
  "iterationsRange": "1,000 - 1,000,000",
  "iterationsTitle": "Iterations",
  "loadingEngine": "Loading engine...",
  "loadingRotations": "Loading rotations...",
  "noRotationsAvailable": insert("No rotations available for {{spec}}. Seed rotations first."),
  "noSettings": "No settings available.",
  "resetOverrides": plural({ one: "Reset {{count}} override", other: "Reset {{count}} overrides" }),
  "resetToDefault": "Reset to default",
  "rotationLabel": "Rotation",
  "rotationPlaceholder": "Select a rotation",
  "rotationTitle": "Rotation",
  "runSimulation": "Run Simulation",
  "settingsCount": plural({ one: "{{count}} setting", other: "{{count}} settings" }),
  "simcImportTitle": "SimC Import",
  "simcInputPlaceholder": "Paste your SimC profile here...",
  "specFallback": insert("Spec {{id}}"),
  "specNotSupported": insert("Spec {{id}} is not supported by this engine build."),
  "submitting": "Submitting...",
  "title": "Simulator",
});
