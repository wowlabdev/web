import { insert } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("activityFeed", {
  // apps/studio/src/components/shared/activity/activity-feed.tsx, apps/studio/src/components/shared/activity/activity-renderer.tsx
  "emptyMessage": "Noch keine Aktivität",
  "simCompleted": insert("{{spec}}-Simulation abgeschlossen"),
  "simFailed": insert("{{spec}}-Simulation fehlgeschlagen"),
  "title": "Aktivität",
  "unknownSpec": "Unbekannt",
});
