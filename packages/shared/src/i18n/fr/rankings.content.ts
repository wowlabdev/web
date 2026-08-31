import { insert } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("rankings", {
  // index — apps/studio/src/components/core/rankings/rankings-index-page.tsx
  "index.itemsDescription": "Tendances des objets à partir des snapshots de classement et des résultats simulés.",
  "index.specsDescription": "Classement des spécialisations avec scores et évolutions par saison.",
  "index.viewItems": "Classement des objets",
  "index.viewSpecs": "Classement des spécialisations",
  // itemsPage — apps/studio/src/components/core/rankings/rankings-index-page.tsx
  "itemsPage.noItemDataDescription": "Aucune donnée de classement d'objets dans la base pour le moment.",
  "itemsPage.noItemDataTitle": "Pas encore de classement d'objets",
  "itemsPage.planned": "Aperçu",
  "itemsPage.viewSpecRankings": "Voir le classement des spés",
  // specsPage — apps/studio/src/components/core/rankings/rankings-index-page.tsx, apps/studio/src/components/core/rankings/rankings-items-page.tsx, apps/studio/src/components/core/rankings/rankings-specs-content.tsx (dynamic)
  "specsPage.active": "Active",
  "specsPage.ended": "Terminée",
  "specsPage.gapFromTop": "Écart avec le #1",
  "specsPage.latestSnapshot": "Dernier snapshot",
  "specsPage.leaderboardTitle": "Classement complet",
  "specsPage.noRankingsDescription": "Aucun classement de spé trouvé pour la saison sélectionnée.",
  "specsPage.noRankingsTitle": "Aucun classement trouvé",
  "specsPage.noSeasons": "Aucune saison",
  "specsPage.rank": "Rang",
  "specsPage.score": "Score",
  "specsPage.scoreDelta": "Variation du score",
  "specsPage.season": "Saison",
  "specsPage.selectSeason": "Choisir une saison",
  "specsPage.spec": "Spé",
  "specsPage.totalSpecs": "Spés classées",
  "specsPage.trend": "Tendance",
  "specsPage.trendDown": insert("baisse {{delta}}"),
  "specsPage.trendFlat": "stable 0",
  "specsPage.trendUp": insert("hausse +{{delta}}"),
  "specsPage.unknownSpec": "Spé inconnue",
  "specsPage.updatedAt": "Mis à jour",
});
