import { insert } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("rankings", {
  // index — apps/studio/src/components/core/rankings/rankings-index-page.tsx
  "index.itemsDescription": "Item trends from ranking snapshots and simulated outcomes.",
  "index.specsDescription": "Spec leaderboard with score and trend changes per season.",
  "index.viewItems": "Item rankings",
  "index.viewSpecs": "Spec rankings",
  // itemsPage — apps/studio/src/components/core/rankings/rankings-index-page.tsx
  "itemsPage.noItemDataDescription": "There is no item ranking data in the database yet.",
  "itemsPage.noItemDataTitle": "No item rankings yet",
  "itemsPage.planned": "Preview",
  "itemsPage.viewSpecRankings": "View spec rankings",
  // specsPage — apps/studio/src/components/core/rankings/rankings-index-page.tsx, apps/studio/src/components/core/rankings/rankings-items-page.tsx, apps/studio/src/components/core/rankings/rankings-specs-content.tsx (dynamic)
  "specsPage.active": "Active",
  "specsPage.ended": "Ended",
  "specsPage.gapFromTop": "Gap from #1",
  "specsPage.latestSnapshot": "Latest snapshot",
  "specsPage.leaderboardTitle": "Full leaderboard",
  "specsPage.noRankingsDescription": "No spec rankings were found for the selected season.",
  "specsPage.noRankingsTitle": "No rankings found",
  "specsPage.noSeasons": "No seasons",
  "specsPage.rank": "Rank",
  "specsPage.score": "Score",
  "specsPage.scoreDelta": "Score delta",
  "specsPage.season": "Season",
  "specsPage.selectSeason": "Select season",
  "specsPage.spec": "Spec",
  "specsPage.totalSpecs": "Ranked specs",
  "specsPage.trend": "Trend",
  "specsPage.trendDown": insert("down {{delta}}"),
  "specsPage.trendFlat": "flat 0",
  "specsPage.trendUp": insert("up +{{delta}}"),
  "specsPage.unknownSpec": "Unknown spec",
  "specsPage.updatedAt": "Updated",
});
