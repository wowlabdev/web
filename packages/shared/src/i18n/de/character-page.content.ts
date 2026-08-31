import { insert } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("characterPage", {
  // apps/studio/src/components/core/simulate/character/character-chip.tsx, apps/studio/src/components/core/simulate/character/character-content.tsx, apps/studio/src/components/core/simulate/character/character-detail.tsx +5 more
  "actionDelete": "Löschen",
  "actionFreeze": "Anheften",
  "actionSetActive": "Aktiv setzen",
  "actionSim": "Simulieren",
  "actionsMenu": "Charakteraktionen",
  "actionUnfreeze": "Lösen",
  "badgeActive": "Aktiv",
  "badgeFrozen": "Angeheftet",
  "deleteDescription": insert("{{name}} samt Snapshot-Verlauf entfernen? Das lässt sich nicht rückgängig machen."),
  "deleteTitle": "Charakter löschen?",
  "emptyDescription": "Importiere ein SimulationCraft-Profil in einer Simulation, dann erscheint der Charakter hier.",
  "emptyTitle": "Noch keine gespeicherten Charaktere",
  "importButton": "Importieren",
  "importDescription": "Füge ein SimulationCraft-Profil ein, um es als Charakter zu speichern.",
  "importErrorNoSpec": "Die Spezialisierung in diesem Profil konnte nicht erkannt werden.",
  "importErrorParse": "Dieses SimC-Profil konnte nicht analysiert werden.",
  "importErrorUnsupported": insert("Spezialisierung {{id}} wird noch nicht unterstützt."),
  "importPlaceholder": "Füge ein SimulationCraft-Profil ein...",
  "importTitle": "Charakter importieren",
  "itemLevel": insert("{{ilvl}} GS"),
  "listTitle": "Gespeicherte Charaktere",
  "resolvedColStat": "Attribut",
  "resolvedColValue": "Wert",
  "resolvedEmpty": "Importiere ein Profil, um Werte aufzulösen.",
  "resolvedError": "Dieser Charakter konnte nicht aufgelöst werden.",
  "resolvedTitle": "Aufgelöste Werte",
  "rosterButton": insert("Alle Charaktere ({{count}})"),
  "selectPrompt": "Wähle einen Charakter, um sein Paperdoll anzuzeigen.",
  "snapshotImported": "Importiert",
  "snapshotsCurrent": "Aktuell",
  "statAttackPower": "Angriffskraft",
  "statHealth": "Gesundheit",
  "statPrimary": "Primärwert",
  "statSpellPower": "Zaubermacht",
  "statsTitle": "Werte",
});
