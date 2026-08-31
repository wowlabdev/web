import { insert } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("simulateBags", {
  // apps/studio/src/components/core/simulate/bags/bags-configure-step.tsx, apps/studio/src/components/core/simulate/bags/block-combinations-dialog.tsx, apps/studio/src/components/core/simulate/bags/confirm-combinations-dialog.tsx
  "blockDialogBody": insert("{{count}} Kombinationen sind mehr, als ich ausführen werde. Geh zurück, schränke deine Auswahl ein und versuch es erneut."),
  "blockDialogConfirm": "Verstanden",
  "blockDialogTitle": "Auswahl ist zu groß",
  "cancel": "Abbrechen",
  "confirmDialogBody": insert("Du hast {{count}} Kombinationen gewählt. Das kann eine Weile dauern. Schränke deine Auswahl für schnellere Ergebnisse ein."),
  "confirmDialogConfirm": "Trotzdem starten",
  "confirmDialogTitle": "Das sind viele Kombinationen",
  "iterationsHint": "1.000 - 1.000.000",
  "iterationsLabel": "Iterationen",
  "loadingRotations": "Lade Rotationen...",
  "noRotations": insert("Keine Rotationen für {{spec}} verfügbar."),
  "rotationLabel": "Rotation",
  "rotationPlaceholder": "Rotation auswählen",
  "simulateButton": "Simulieren",
  "simulateCombinationsButton": "Kombinationen simulieren",
  "submitting": "Sende",
});
