import { insert } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("rankings", {
  // index — apps/studio/src/components/core/rankings/rankings-index-page.tsx
  "index.itemsDescription": "Item-Trends aus Ranking-Snapshots und simulierten Ergebnissen.",
  "index.specsDescription": "Spec-Leaderboard mit Score- und Trendentwicklung je Saison.",
  "index.viewItems": "Item-Rankings",
  "index.viewSpecs": "Spec-Rankings",
  // itemsPage — apps/studio/src/components/core/rankings/rankings-index-page.tsx
  "itemsPage.noItemDataDescription": "Für Item-Rankings sind aktuell noch keine Daten in der Datenbank vorhanden.",
  "itemsPage.noItemDataTitle": "Noch keine Item-Rankings",
  "itemsPage.planned": "Vorschau",
  "itemsPage.viewSpecRankings": "Spec-Rankings anzeigen",
  // specsPage — apps/studio/src/components/core/rankings/rankings-index-page.tsx, apps/studio/src/components/core/rankings/rankings-items-page.tsx, apps/studio/src/components/core/rankings/rankings-specs-content.tsx (dynamic)
  "specsPage.active": "Aktiv",
  "specsPage.ended": "Beendet",
  "specsPage.gapFromTop": "Abstand zu #1",
  "specsPage.latestSnapshot": "Letzter Snapshot",
  "specsPage.leaderboardTitle": "Gesamtranking",
  "specsPage.noRankingsDescription": "Für die ausgewählte Saison wurden keine Spec-Rankings gefunden.",
  "specsPage.noRankingsTitle": "Keine Rankings gefunden",
  "specsPage.noSeasons": "Keine Saisons",
  "specsPage.rank": "Rang",
  "specsPage.score": "Score",
  "specsPage.scoreDelta": "Score-Diff",
  "specsPage.season": "Saison",
  "specsPage.selectSeason": "Saison auswählen",
  "specsPage.spec": "Spezialisierung",
  "specsPage.totalSpecs": "Specs im Ranking",
  "specsPage.trend": "Trend",
  "specsPage.trendDown": insert("runter {{delta}}"),
  "specsPage.trendFlat": "stabil 0",
  "specsPage.trendUp": insert("hoch +{{delta}}"),
  "specsPage.unknownSpec": "Unbekannte Spezialisierung",
  "specsPage.updatedAt": "Aktualisiert",
});
