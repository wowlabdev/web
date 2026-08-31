import { insert, plural } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("studioHome", {
  // apps/studio/src/components/shared/studio/studio-home-view.tsx
  "charactersRecent": insert("{{count}} kürzlich"),
  "charactersTitle": "Deine Charaktere",
  "emptyCharacters": "Noch keine Charaktere. Importiere einen aus einer Simulation.",
  "emptySims": "Noch keine Sims.",
  "lastUsed": "Zuletzt verwendet",
  "newSim": "Neue Sim",
  "pickUp": "Mach da weiter, wo du aufgehört hast.",
  "recentSims": "Letzte Sims",
  "runningCount": plural({ one: "{{count}} Sim läuft. Mach da weiter, wo du aufgehört hast.", other: "{{count}} Sims laufen. Mach da weiter, wo du aufgehört hast." }),
  "sim": "Simulieren",
  "statusDone": "Fertig",
  "statusFailed": "Fehlgeschlagen",
  "statusQueued": "In Warteschlange",
  "statusRunning": "Läuft",
  "viewAll": "Alle ansehen",
  "welcomeBack": "Willkommen zurück.",
});
