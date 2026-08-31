import { insert } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("characterPage", {
  // apps/studio/src/components/core/simulate/character/character-chip.tsx, apps/studio/src/components/core/simulate/character/character-content.tsx, apps/studio/src/components/core/simulate/character/character-detail.tsx +5 more
  "actionDelete": "Delete",
  "actionFreeze": "Freeze",
  "actionSetActive": "Set active",
  "actionSim": "Sim",
  "actionsMenu": "Character actions",
  "actionUnfreeze": "Unfreeze",
  "badgeActive": "Active",
  "badgeFrozen": "Frozen",
  "deleteDescription": insert("Remove {{name}} and its snapshot history? This can't be undone."),
  "deleteTitle": "Delete character?",
  "emptyDescription": "Import a SimulationCraft profile in a sim and the character shows up here.",
  "emptyTitle": "No saved characters yet",
  "importButton": "Import",
  "importDescription": "Paste a SimulationCraft profile to save it as a character.",
  "importErrorNoSpec": "Couldn't detect the spec in that profile.",
  "importErrorParse": "Couldn't parse that SimC profile.",
  "importErrorUnsupported": insert("Spec {{id}} isn't supported yet."),
  "importPlaceholder": "Paste a SimulationCraft profile...",
  "importTitle": "Import a character",
  "itemLevel": insert("{{ilvl}} ilvl"),
  "listTitle": "Saved characters",
  "resolvedColStat": "Stat",
  "resolvedColValue": "Value",
  "resolvedEmpty": "Import a profile to resolve stats.",
  "resolvedError": "Could not resolve this character.",
  "resolvedTitle": "Resolved stats",
  "rosterButton": insert("All characters ({{count}})"),
  "selectPrompt": "Select a character to view its paperdoll.",
  "snapshotImported": "Imported",
  "snapshotsCurrent": "Current",
  "statAttackPower": "Attack Power",
  "statHealth": "Health",
  "statPrimary": "Primary",
  "statSpellPower": "Spell Power",
  "statsTitle": "Stats",
});
