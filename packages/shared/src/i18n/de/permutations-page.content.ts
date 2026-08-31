import { insert, plural } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("permutationsPage", {
  // candidatesTab — apps/studio/src/components/int/permutations/tabs/candidates-tab.tsx
  "candidatesTab.headerCount": "Anzahl",
  "candidatesTab.headerItems": "Gegenstände",
  "candidatesTab.headerSlot": "Slot",
  "candidatesTab.headerSources": "Ang./Tasche/Wö.",
  "candidatesTab.title": "Kandidaten pro Slot",
  // costTab — apps/studio/src/components/int/permutations/tabs/cost-tab.tsx
  "costTab.bruteForceChange": insert("{{total}} × 10K"),
  "costTab.bruteForceTitle": "Brute Force",
  "costTab.factorialChange": plural({ one: "{{main}} Haupt + {{pairs}} Paar", other: "{{main}} Haupt + {{pairs}} Paare" }),
  "costTab.factorialTitle": "Fakultät gesamt",
  "costTab.headerKeepPct": "Behalten%",
  "costTab.headerSavings": "Ersparnis",
  "costTab.headerSurvivors": "Überlebende",
  "costTab.headerTotal": "Gesamt",
  "costTab.headerTournament": "Turnier",
  "costTab.pairwiseChange": plural({ one: "Top-{{pairs}} Paar", other: "Top-{{pairs}} Paare" }),
  "costTab.pairwiseTitle": "Paarweise Iter.",
  "costTab.screeningTitle": "Vorauswahl + Turnier",
  // customSetTab — apps/studio/src/components/int/permutations/tabs/custom-set-tab.tsx
  "customSetTab.bonusIds": insert("Boni {{ids}}"),
  "customSetTab.copyJson": "JSON kopieren",
  "customSetTab.copyToAddon": "In Addon kopieren",
  "customSetTab.copyToAddonDone": "Kopiert",
  "customSetTab.description": "Wähle pro Slot einen Gegenstand aus dem geparsten Profil und kopiere das Ergebnis als wowlab-Parcel-Umschlag, um es zum Round-Trip-Test ins Addon einzufügen.",
  "customSetTab.headerBonusIds": "Bonus-IDs",
  "customSetTab.headerPick": "Auswahl",
  "customSetTab.headerPreview": "Vorschau",
  "customSetTab.headerSlot": "Slot",
  "customSetTab.resetToEquipped": "Auf angelegt zurücksetzen",
  "customSetTab.title": "Eigenes Set",
  // importTab — apps/studio/src/components/int/permutations/tabs/import-tab.tsx
  "importTab.clear": "Leeren",
  "importTab.helper": "Das Profil wird automatisch geparst; wechsle zu einem Tab, sobald es grün ist.",
  "importTab.label": "SimC-Profil",
  "importTab.loadExample": "Beispiel laden",
  "importTab.placeholder": "Füge hier dein SimC-Profil ein...",
  // overviewTab — apps/studio/src/components/int/permutations/tabs/overview-tab.tsx
  "overviewTab.bruteForceChange": "× 10K Iter. / Perm.",
  "overviewTab.bruteForceTitle": "Brute Force",
  "overviewTab.candidatesChange": insert("{{bag}} Tasche · {{weekly}} wöchentlich"),
  "overviewTab.candidatesTitle": "Kandidaten",
  "overviewTab.contestedLabel": "umkämpft",
  "overviewTab.contestedRatio": plural({ one: "{{contested}} von {{total}} Slot", other: "{{contested}} von {{total}} Slots" }),
  "overviewTab.contestedSlotsChange": plural({ one: "{{count}} unumkämpft", other: "{{count}} unumkämpft" }),
  "overviewTab.contestedSlotsTitle": "Umkämpfte Slots",
  "overviewTab.level": insert("Stufe {{level}}"),
  "overviewTab.permutationsTitle": "Permutationen",
  // permutationsTab — apps/studio/src/components/int/permutations/tabs/permutations-tab.tsx
  "permutationsTab.headerIndex": "#",
  "permutationsTab.showing": insert("Zeige {{shown}} von {{total}}"),
  "permutationsTab.title": "Permutationen",
  // apps/studio/src/components/int/permutations/permutations-content.tsx
  "tabCandidates": "Kandidaten",
  "tabCost": "Kosten",
  "tabCustomSet": "Eigenes Set",
  "tabImport": "Import",
  "tabOverview": "Übersicht",
  "tabPermutations": "Permutationen",
  // whatIfPanel — apps/studio/src/components/int/permutations/tabs/what-if-panel.tsx
  "whatIfPanel.enchantsLine": plural({ one: "× {{formattedCount}} Verzauberung", other: "× {{formattedCount}} Verzauberungen" }),
  "whatIfPanel.enchantSlots": "Verzauberungsslots",
  "whatIfPanel.gemsLine": plural({ one: "× {{formattedCount}} Sockelstein", other: "× {{formattedCount}} Sockelsteine" }),
  "whatIfPanel.gemSlots": "Sockelplätze",
  "whatIfPanel.perSlot": "Pro Slot",
  "whatIfPanel.title": "Was-wäre-wenn: Verzauberungen & Sockelsteine",
});
