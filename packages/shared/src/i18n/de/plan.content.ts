import { insert, plural } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("plan", {
  // apps/studio/src/components/core/plan/dungeon/components/dungeon-select.tsx, apps/studio/src/components/core/plan/dungeon/components/pull-list.tsx, apps/studio/src/components/core/plan/dungeon/components/selection-panel.tsx +4 more
  "dungeonAllPulls": "Alle Pulls",
  "dungeonFailedToLoad": "Etagendaten konnten nicht geladen werden.",
  "dungeonHideEnemies": "Gegner ausblenden",
  "dungeonLabel": "Dungeon",
  "dungeonLegendMob": "Gegner",
  "dungeonLegendPack": "Gegnergruppen-Hülle",
  "dungeonLegendPatrol": "Patrouille (gestrichelt)",
  "dungeonLegendPull": "Pull (Farbe pro Pull)",
  "dungeonNoDataIntro": "Keine Dungeon-Daten verfügbar. Führe",
  "dungeonNoDataOutro": "aus, um Daten und Kacheln zu synchronisieren.",
  "dungeonPullEnemies": plural({ one: "Pull {{index}} · {{count}} Gegner", other: "Pull {{index}} · {{count}} Gegner" }),
  "dungeonPullFocused": " · fokussiert",
  "dungeonPullPacks": plural({ one: "{{count}} Gruppe", other: "{{count}} Gruppen" }),
  "dungeonPullsEmpty": "Für diese Etage sind keine Pull-Gruppen definiert.",
  "dungeonPullsTitle": insert("Pulls ({{count}})"),
  "dungeonSelectionEmpty": "Klicke auf einen Gegner oder eine Gruppen-Hülle, um sie zu inspizieren. Mausrad zum Zoomen, ziehen zum Verschieben.",
  "dungeonSelectionId": "id",
  "dungeonSelectionKind": "Art",
  "dungeonSelectionLayer": "Ebene",
  "dungeonSelectionTitle": "Auswahl",
  "dungeonShowEnemies": "Gegner anzeigen",
  "talentsFailedToLoad": "Talentbaum konnte nicht geladen werden.",
  "talentsImport": "Importieren",
  "talentsImportDescription": "Füge einen Talent-Loadout-String ein und dekodiere ihn mit WASM. Der Talentbaum wird unten auf Basis des gemeinsamen Canvas gerendert.",
  "talentsImportTitle": "Talente importieren",
  "talentsInvalidLoadout": "Ungültiger Loadout-String.",
  "talentsLoadoutLabel": "Loadout-String",
});
