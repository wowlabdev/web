import { insert, plural } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("simulatorPage", {
  // apps/studio/src/components/core/simulator/engine-skeleton.tsx, apps/studio/src/components/core/simulator/settings/setting-field.tsx, apps/studio/src/components/core/simulator/settings/settings-panel.tsx +7 more
  "assignedChunks": "Zugewiesene Chunks",
  "benchmark": "Benchmark",
  "cannotDetectSpec": "Spezialisierung konnte nicht aus dem Talente-String erkannt werden.",
  "chunksReceived": plural({ one: "{{count}} Chunk erhalten", other: "{{count}} Chunks erhalten" }),
  "clearAllJobs": "Alle Jobs löschen",
  "clearing": "Lösche...",
  "confirmDeleteAllJobs": "ALLE Jobs löschen? Das kann nicht rückgängig gemacht werden.",
  "failedToClearJobs": "Jobs konnten nicht gelöscht werden.",
  "failedToParseProfile": "Profil konnte nicht eingelesen werden.",
  "failedToSubmitJob": "Job konnte nicht abgeschickt werden.",
  "iterationsRange": "1.000 - 1.000.000",
  "iterationsTitle": "Iterationen",
  "loadingEngine": "Engine lädt...",
  "loadingRotations": "Rotationen werden geladen...",
  "noRotationsAvailable": insert("Keine Rotationen für {{spec}} verfügbar. Rotationen zuerst anlegen."),
  "noSettings": "Keine Einstellungen verfügbar.",
  "resetOverrides": plural({ one: "{{count}} Override zurücksetzen", other: "{{count}} Overrides zurücksetzen" }),
  "resetToDefault": "Auf Standard zurücksetzen",
  "rotationLabel": "Rotation",
  "rotationPlaceholder": "Rotation auswählen",
  "rotationTitle": "Rotation",
  "runSimulation": "Simulation starten",
  "settingsCount": plural({ one: "{{count}} Einstellung", other: "{{count}} Einstellungen" }),
  "simcImportTitle": "SimC-Import",
  "simcInputPlaceholder": "SimC-Profil hier einfügen...",
  "specFallback": insert("Spec {{id}}"),
  "specNotSupported": insert("Spec {{id}} wird von diesem Engine-Build nicht unterstützt."),
  "submitting": "Sende...",
  "title": "Simulator",
});
