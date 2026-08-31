import { insert } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("characterPage", {
  // apps/studio/src/components/core/simulate/character/character-chip.tsx, apps/studio/src/components/core/simulate/character/character-content.tsx, apps/studio/src/components/core/simulate/character/character-detail.tsx +5 more
  "actionDelete": "Supprimer",
  "actionFreeze": "Épingler",
  "actionSetActive": "Activer",
  "actionSim": "Simuler",
  "actionsMenu": "Actions du personnage",
  "actionUnfreeze": "Détacher",
  "badgeActive": "Actif",
  "badgeFrozen": "Épinglé",
  "deleteDescription": insert("Supprimer {{name}} et son historique de snapshots ? Action irréversible."),
  "deleteTitle": "Supprimer le personnage ?",
  "emptyDescription": "Importez un profil SimulationCraft dans une simulation et le personnage apparaît ici.",
  "emptyTitle": "Aucun personnage enregistré",
  "importButton": "Importer",
  "importDescription": "Collez un profil SimulationCraft pour l'enregistrer comme personnage.",
  "importErrorNoSpec": "Impossible de détecter la spécialisation dans ce profil.",
  "importErrorParse": "Impossible d'analyser ce profil SimC.",
  "importErrorUnsupported": insert("La spécialisation {{id}} n'est pas encore prise en charge."),
  "importPlaceholder": "Collez un profil SimulationCraft...",
  "importTitle": "Importer un personnage",
  "itemLevel": insert("{{ilvl}} niv. objet"),
  "listTitle": "Personnages enregistrés",
  "resolvedColStat": "Statistique",
  "resolvedColValue": "Valeur",
  "resolvedEmpty": "Importez un profil pour résoudre les statistiques.",
  "resolvedError": "Impossible de résoudre ce personnage.",
  "resolvedTitle": "Statistiques résolues",
  "rosterButton": insert("Tous les personnages ({{count}})"),
  "selectPrompt": "Sélectionnez un personnage pour voir son paperdoll.",
  "snapshotImported": "Importé",
  "snapshotsCurrent": "Actuel",
  "statAttackPower": "Puissance d'attaque",
  "statHealth": "Santé",
  "statPrimary": "Principale",
  "statSpellPower": "Puissance des sorts",
  "statsTitle": "Statistiques",
});
