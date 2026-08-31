import { insert, plural } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("simulatorPage", {
  // apps/studio/src/components/core/simulator/engine-skeleton.tsx, apps/studio/src/components/core/simulator/settings/setting-field.tsx, apps/studio/src/components/core/simulator/settings/settings-panel.tsx +7 more
  "assignedChunks": "Chunks assignés",
  "benchmark": "Benchmark",
  "cannotDetectSpec": "Impossible de détecter la spécialisation depuis la chaîne de talents.",
  "chunksReceived": plural({ one: "{{count}} chunk reçu", other: "{{count}} chunks reçus" }),
  "clearAllJobs": "Effacer tous les jobs",
  "clearing": "Effacement...",
  "confirmDeleteAllJobs": "Supprimer TOUS les jobs ? C'est irréversible.",
  "failedToClearJobs": "Échec de la suppression des jobs.",
  "failedToParseProfile": "Échec de l'analyse du profil.",
  "failedToSubmitJob": "Échec de l'envoi du job.",
  "iterationsRange": "1 000 - 1 000 000",
  "iterationsTitle": "Itérations",
  "loadingEngine": "Chargement de l'engine...",
  "loadingRotations": "Chargement des rotations...",
  "noRotationsAvailable": insert("Aucune rotation disponible pour {{spec}}. Initialisez les rotations d'abord."),
  "noSettings": "Aucun paramètre disponible.",
  "resetOverrides": plural({ one: "Réinitialiser {{count}} surcharge", other: "Réinitialiser {{count}} surcharges" }),
  "resetToDefault": "Réinitialiser par défaut",
  "rotationLabel": "Rotation",
  "rotationPlaceholder": "Sélectionnez une rotation",
  "rotationTitle": "Rotation",
  "runSimulation": "Lancer la simulation",
  "settingsCount": plural({ one: "{{count}} paramètre", other: "{{count}} paramètres" }),
  "simcImportTitle": "Import SimC",
  "simcInputPlaceholder": "Collez votre profil SimC ici...",
  "specFallback": insert("Spé {{id}}"),
  "specNotSupported": insert("La spé {{id}} n'est pas prise en charge par cette version de l'engine."),
  "submitting": "Envoi...",
  "title": "Simulateur",
});
