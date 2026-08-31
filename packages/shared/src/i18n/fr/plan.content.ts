import { insert, plural } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("plan", {
  // apps/studio/src/components/core/plan/dungeon/components/dungeon-select.tsx, apps/studio/src/components/core/plan/dungeon/components/pull-list.tsx, apps/studio/src/components/core/plan/dungeon/components/selection-panel.tsx +4 more
  "dungeonAllPulls": "Tous les pulls",
  "dungeonFailedToLoad": "Échec du chargement des données d'étage.",
  "dungeonHideEnemies": "Masquer les ennemis",
  "dungeonLabel": "Donjon",
  "dungeonLegendMob": "Créature",
  "dungeonLegendPack": "Enveloppe du groupe d'ennemis",
  "dungeonLegendPatrol": "Patrouille (pointillés)",
  "dungeonLegendPull": "Pull (couleur par pull)",
  "dungeonNoDataIntro": "Aucune donnée de donjon disponible. Lance",
  "dungeonNoDataOutro": "pour synchroniser les données et les tuiles.",
  "dungeonPullEnemies": plural({ one: "Pull {{index}} · {{count}} ennemi", other: "Pull {{index}} · {{count}} ennemis" }),
  "dungeonPullFocused": " · ciblé",
  "dungeonPullPacks": plural({ one: "{{count}} groupe", other: "{{count}} groupes" }),
  "dungeonPullsEmpty": "Aucun groupe de pull défini pour cette étage.",
  "dungeonPullsTitle": insert("Pulls ({{count}})"),
  "dungeonSelectionEmpty": "Clique sur un ennemi ou une enveloppe de groupe pour l'inspecter. Molette pour zoomer, glisse pour te déplacer.",
  "dungeonSelectionId": "id",
  "dungeonSelectionKind": "type",
  "dungeonSelectionLayer": "calque",
  "dungeonSelectionTitle": "Sélection",
  "dungeonShowEnemies": "Afficher les ennemis",
  "talentsFailedToLoad": "Échec du chargement de l'arbre de talents.",
  "talentsImport": "Importer",
  "talentsImportDescription": "Colle une chaîne de loadout de talents, puis décode-la avec WASM. L'arbre de talents s'affiche ci-dessous via le canvas commun.",
  "talentsImportTitle": "Importer des talents",
  "talentsInvalidLoadout": "Chaîne de loadout invalide.",
  "talentsLoadoutLabel": "Chaîne de loadout",
});
