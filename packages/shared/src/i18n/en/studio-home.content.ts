import { insert, plural } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("studioHome", {
  // apps/studio/src/components/shared/studio/studio-home-view.tsx
  "charactersRecent": insert("{{count}} recent"),
  "charactersTitle": "Your characters",
  "emptyCharacters": "No characters yet. Import one from a sim.",
  "emptySims": "No sims yet.",
  "lastUsed": "Last used",
  "newSim": "New sim",
  "pickUp": "Pick up where you left off.",
  "recentSims": "Recent sims",
  "runningCount": plural({ one: "{{count}} sim running. Pick up where you left off.", other: "{{count}} sims running. Pick up where you left off." }),
  "sim": "Sim",
  "statusDone": "Done",
  "statusFailed": "Failed",
  "statusQueued": "Queued",
  "statusRunning": "Running",
  "viewAll": "View all",
  "welcomeBack": "Welcome back.",
});
