import { insert } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("activityFeed", {
  // apps/studio/src/components/shared/activity/activity-feed.tsx, apps/studio/src/components/shared/activity/activity-renderer.tsx
  "emptyMessage": "Aucune activité pour le moment",
  "simCompleted": insert("Simulation {{spec}} terminée"),
  "simFailed": insert("Simulation {{spec}} échouée"),
  "title": "Activité",
  "unknownSpec": "Inconnu",
});
