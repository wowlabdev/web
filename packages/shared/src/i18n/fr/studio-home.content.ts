import { insert, plural } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("studioHome", {
  // apps/studio/src/components/shared/studio/studio-home-view.tsx
  "charactersRecent": insert("{{count}} récents"),
  "charactersTitle": "Tes personnages",
  "emptyCharacters": "Aucun personnage. Importe-en un depuis une simulation.",
  "emptySims": "Aucune sim.",
  "lastUsed": "Dernière utilisation",
  "newSim": "Nouvelle sim",
  "pickUp": "Reprends où tu t'es arrêté.",
  "recentSims": "Sims récentes",
  "runningCount": plural({ one: "{{count}} sim en cours. Reprends où tu t'es arrêté.", other: "{{count}} sims en cours. Reprends où tu t'es arrêté." }),
  "sim": "Simuler",
  "statusDone": "Terminé",
  "statusFailed": "Échec",
  "statusQueued": "En file",
  "statusRunning": "En cours",
  "viewAll": "Tout voir",
  "welcomeBack": "Bon retour.",
});
