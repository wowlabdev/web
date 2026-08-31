import { insert } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("simulateDrops", {
  // apps/studio/src/components/core/simulate/drops/drops-configure-step.tsx, apps/studio/src/components/core/simulate/drops/drops-sources-step.tsx
  "headerInstance": "Instanz",
  "iterationsHint": "1.000 - 1.000.000",
  "iterationsLabel": "Iterationen",
  "keyLevelHint": insert("+{{level}}"),
  "keyLevelLabel": "Mythisch+ Schlüsselstufe",
  "loadingRotations": "Lade Rotationen...",
  "lootCategoriesTitle": "Beute-Kategorien",
  "noRotations": insert("Keine Rotationen für {{spec}} verfügbar."),
  "raidDifficultyLabel": "Schlachtzug-Schwierigkeit",
  "rotationLabel": "Rotation",
  "rotationPlaceholder": "Rotation auswählen",
  "runSimulation": "Simulation starten",
  "statCategoriesAvailable": insert("{{count}} verfügbar"),
  "statCategoriesTitle": "Kategorien",
  "statSourcesSubtitle": "Instanzen ausgewählt",
  "statSourcesTitle": "Quellen ausgewählt",
  "submitting": "Sende...",
});
