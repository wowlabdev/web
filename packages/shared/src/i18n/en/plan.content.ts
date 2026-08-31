import { insert, plural } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("plan", {
  // apps/studio/src/components/core/plan/dungeon/components/dungeon-select.tsx, apps/studio/src/components/core/plan/dungeon/components/pull-list.tsx, apps/studio/src/components/core/plan/dungeon/components/selection-panel.tsx +4 more
  "dungeonAllPulls": "All pulls",
  "dungeonFailedToLoad": "Failed to load floor data.",
  "dungeonHideEnemies": "Hide enemies",
  "dungeonLabel": "Dungeon",
  "dungeonLegendMob": "Mob",
  "dungeonLegendPack": "Enemy pack hull",
  "dungeonLegendPatrol": "Patrol (dashed)",
  "dungeonLegendPull": "Pull (per-pull color)",
  "dungeonNoDataIntro": "No dungeon data available. Run",
  "dungeonNoDataOutro": "to sync data and tiles.",
  "dungeonPullEnemies": plural({ one: "Pull {{index}} · {{count}} enemy", other: "Pull {{index}} · {{count}} enemies" }),
  "dungeonPullFocused": " · focused",
  "dungeonPullPacks": plural({ one: "{{count}} pack", other: "{{count}} packs" }),
  "dungeonPullsEmpty": "No pull groups defined for this floor.",
  "dungeonPullsTitle": insert("Pulls ({{count}})"),
  "dungeonSelectionEmpty": "Click any enemy or pack hull to inspect it. Wheel zoom, drag to pan.",
  "dungeonSelectionId": "id",
  "dungeonSelectionKind": "kind",
  "dungeonSelectionLayer": "layer",
  "dungeonSelectionTitle": "Selection",
  "dungeonShowEnemies": "Show enemies",
  "talentsFailedToLoad": "Failed to load talent tree.",
  "talentsImport": "Import",
  "talentsImportDescription": "Paste a talent loadout string, then decode it with WASM. The talent tree renders below using the shared canvas foundation.",
  "talentsImportTitle": "Import talents",
  "talentsInvalidLoadout": "Invalid loadout string.",
  "talentsLoadoutLabel": "Loadout string",
});
