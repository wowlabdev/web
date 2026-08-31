import { insert, plural } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("permutationsPage", {
  // candidatesTab — apps/studio/src/components/int/permutations/tabs/candidates-tab.tsx
  "candidatesTab.headerCount": "Nombre",
  "candidatesTab.headerItems": "Objets",
  "candidatesTab.headerSlot": "Emplacement",
  "candidatesTab.headerSources": "Équ./Sac/Hebdo",
  "candidatesTab.title": "Candidats par emplacement",
  // costTab — apps/studio/src/components/int/permutations/tabs/cost-tab.tsx
  "costTab.bruteForceChange": insert("{{total}} × 10K"),
  "costTab.bruteForceTitle": "Force brute",
  "costTab.factorialChange": plural({ one: "{{main}} principal + {{pairs}} paire", other: "{{main}} principal + {{pairs}} paires" }),
  "costTab.factorialTitle": "Total factoriel",
  "costTab.headerKeepPct": "Gardé%",
  "costTab.headerSavings": "Économie",
  "costTab.headerSurvivors": "Survivants",
  "costTab.headerTotal": "Total",
  "costTab.headerTournament": "Tournoi",
  "costTab.pairwiseChange": plural({ one: "top-{{pairs}} paire", other: "top-{{pairs}} paires" }),
  "costTab.pairwiseTitle": "Itér. par paires",
  "costTab.screeningTitle": "Présélection + tournoi",
  // customSetTab — apps/studio/src/components/int/permutations/tabs/custom-set-tab.tsx
  "customSetTab.bonusIds": insert("bonus {{ids}}"),
  "customSetTab.copyJson": "Copier le JSON",
  "customSetTab.copyToAddon": "Copier vers l’addon",
  "customSetTab.copyToAddonDone": "Copié",
  "customSetTab.description": "Choisissez un objet par emplacement dans le profil analysé, puis copiez le résultat sous forme d’enveloppe parcel wowlab à coller dans l’addon pour un test aller-retour.",
  "customSetTab.headerBonusIds": "ID de bonus",
  "customSetTab.headerPick": "Choix",
  "customSetTab.headerPreview": "Aperçu",
  "customSetTab.headerSlot": "Emplacement",
  "customSetTab.resetToEquipped": "Réinitialiser à l’équipé",
  "customSetTab.title": "Set personnalisé",
  // importTab — apps/studio/src/components/int/permutations/tabs/import-tab.tsx
  "importTab.clear": "Effacer",
  "importTab.helper": "Le profil est analysé automatiquement ; passez à un onglet une fois qu’il est vert.",
  "importTab.label": "Profil SimC",
  "importTab.loadExample": "Charger l’exemple",
  "importTab.placeholder": "Collez votre profil SimC ici...",
  // overviewTab — apps/studio/src/components/int/permutations/tabs/overview-tab.tsx
  "overviewTab.bruteForceChange": "× 10K itér. / perm.",
  "overviewTab.bruteForceTitle": "Force brute",
  "overviewTab.candidatesChange": insert("{{bag}} sac · {{weekly}} hebdo"),
  "overviewTab.candidatesTitle": "Candidats",
  "overviewTab.contestedLabel": "disputés",
  "overviewTab.contestedRatio": plural({ one: "{{contested}} sur {{total}} emplacement", other: "{{contested}} sur {{total}} emplacements" }),
  "overviewTab.contestedSlotsChange": plural({ one: "{{count}} non disputé", other: "{{count}} non disputés" }),
  "overviewTab.contestedSlotsTitle": "Emplacements disputés",
  "overviewTab.level": insert("Niveau {{level}}"),
  "overviewTab.permutationsTitle": "Permutations",
  // permutationsTab — apps/studio/src/components/int/permutations/tabs/permutations-tab.tsx
  "permutationsTab.headerIndex": "#",
  "permutationsTab.showing": insert("Affichage de {{shown}} sur {{total}}"),
  "permutationsTab.title": "Permutations",
  // apps/studio/src/components/int/permutations/permutations-content.tsx
  "tabCandidates": "Candidats",
  "tabCost": "Coût",
  "tabCustomSet": "Set personnalisé",
  "tabImport": "Importer",
  "tabOverview": "Aperçu",
  "tabPermutations": "Permutations",
  // whatIfPanel — apps/studio/src/components/int/permutations/tabs/what-if-panel.tsx
  "whatIfPanel.enchantsLine": plural({ one: "× {{formattedCount}} enchantement", other: "× {{formattedCount}} enchantements" }),
  "whatIfPanel.enchantSlots": "Emplacements d’enchantement",
  "whatIfPanel.gemsLine": plural({ one: "× {{formattedCount}} gemme", other: "× {{formattedCount}} gemmes" }),
  "whatIfPanel.gemSlots": "Emplacements de gemmes",
  "whatIfPanel.perSlot": "Par emplacement",
  "whatIfPanel.title": "Et si : enchantements & gemmes",
});
