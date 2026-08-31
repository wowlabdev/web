import { insert } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("activityFeed", {
  // apps/studio/src/components/shared/activity/activity-feed.tsx, apps/studio/src/components/shared/activity/activity-renderer.tsx
  "emptyMessage": "No activity yet",
  "simCompleted": insert("{{spec}} simulation completed"),
  "simFailed": insert("{{spec}} simulation failed"),
  "title": "Activity",
  "unknownSpec": "Unknown",
});
