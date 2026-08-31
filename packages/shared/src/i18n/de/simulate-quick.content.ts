import { insert } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("simulateQuick", {
  // apps/studio/src/components/core/simulate/quick/quick-sim-configure-step.tsx
  "equipmentTitle": "Ausrüstung",
  "equippedItemsSubtitle": "aktuell getragen",
  "equippedItemsTitle": "Ausgerüstete Gegenstände",
  "headerItem": "Gegenstand",
  "headerSlot": "Slot",
  "iterationsHint": "1.000 - 1.000.000",
  "iterationsLabel": "Iterationen",
  "loadingRotations": "Lade Rotationen...",
  "noRotations": insert("Keine Rotationen für {{spec}} verfügbar."),
  "rotationLabel": "Rotation",
  "rotationPlaceholder": "Rotation auswählen",
  "runSimulation": "Simulation starten",
  "specFallback": "—",
  "specSubtitle": insert("{{name}} · Stufe {{level}}"),
  "specTitle": "Spezialisierung",
  "submitting": "Sende...",
});
