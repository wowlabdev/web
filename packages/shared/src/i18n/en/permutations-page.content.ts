import { insert, plural } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("permutationsPage", {
  // candidatesTab — apps/studio/src/components/int/permutations/tabs/candidates-tab.tsx
  "candidatesTab.headerCount": "Count",
  "candidatesTab.headerItems": "Items",
  "candidatesTab.headerSlot": "Slot",
  "candidatesTab.headerSources": "Eq/Bag/Wk",
  "candidatesTab.title": "Per-slot candidates",
  // costTab — apps/studio/src/components/int/permutations/tabs/cost-tab.tsx
  "costTab.bruteForceChange": insert("{{total}} × 10K"),
  "costTab.bruteForceTitle": "Brute force",
  "costTab.factorialChange": plural({ one: "{{main}} main + {{pairs}} pair", other: "{{main}} main + {{pairs}} pairs" }),
  "costTab.factorialTitle": "Factorial total",
  "costTab.headerKeepPct": "Keep%",
  "costTab.headerSavings": "Savings",
  "costTab.headerSurvivors": "Survivors",
  "costTab.headerTotal": "Total",
  "costTab.headerTournament": "Tournament",
  "costTab.pairwiseChange": plural({ one: "top-{{pairs}} pair", other: "top-{{pairs}} pairs" }),
  "costTab.pairwiseTitle": "Pairwise iters",
  "costTab.screeningTitle": "Screening + tournament",
  // customSetTab — apps/studio/src/components/int/permutations/tabs/custom-set-tab.tsx
  "customSetTab.bonusIds": insert("bonuses {{ids}}"),
  "customSetTab.copyJson": "Copy JSON",
  "customSetTab.copyToAddon": "Copy to addon",
  "customSetTab.copyToAddonDone": "Copied",
  "customSetTab.description": "Pick one item per slot from the parsed profile, then copy the result as a wowlab parcel envelope to paste into the addon for round-trip testing.",
  "customSetTab.headerBonusIds": "Bonus IDs",
  "customSetTab.headerPick": "Pick",
  "customSetTab.headerPreview": "Preview",
  "customSetTab.headerSlot": "Slot",
  "customSetTab.resetToEquipped": "Reset to equipped",
  "customSetTab.title": "Custom set",
  // importTab — apps/studio/src/components/int/permutations/tabs/import-tab.tsx
  "importTab.clear": "Clear",
  "importTab.helper": "Profile parses automatically; switch to a tab once it’s green.",
  "importTab.label": "SimC Profile",
  "importTab.loadExample": "Load example",
  "importTab.placeholder": "Paste your SimC profile here...",
  // overviewTab — apps/studio/src/components/int/permutations/tabs/overview-tab.tsx
  "overviewTab.bruteForceChange": "× 10K iters / perm",
  "overviewTab.bruteForceTitle": "Brute force",
  "overviewTab.candidatesChange": insert("{{bag}} bag · {{weekly}} weekly"),
  "overviewTab.candidatesTitle": "Candidates",
  "overviewTab.contestedLabel": "contested",
  "overviewTab.contestedRatio": plural({ one: "{{contested}} of {{total}} slot", other: "{{contested}} of {{total}} slots" }),
  "overviewTab.contestedSlotsChange": plural({ one: "{{count}} uncontested", other: "{{count}} uncontested" }),
  "overviewTab.contestedSlotsTitle": "Contested slots",
  "overviewTab.level": insert("Level {{level}}"),
  "overviewTab.permutationsTitle": "Permutations",
  // permutationsTab — apps/studio/src/components/int/permutations/tabs/permutations-tab.tsx
  "permutationsTab.headerIndex": "#",
  "permutationsTab.showing": insert("Showing {{shown}} of {{total}}"),
  "permutationsTab.title": "Permutations",
  // apps/studio/src/components/int/permutations/permutations-content.tsx
  "tabCandidates": "Candidates",
  "tabCost": "Cost",
  "tabCustomSet": "Custom Set",
  "tabImport": "Import",
  "tabOverview": "Overview",
  "tabPermutations": "Permutations",
  // whatIfPanel — apps/studio/src/components/int/permutations/tabs/what-if-panel.tsx
  "whatIfPanel.enchantsLine": plural({ one: "× {{formattedCount}} enchant", other: "× {{formattedCount}} enchants" }),
  "whatIfPanel.enchantSlots": "Enchant slots",
  "whatIfPanel.gemsLine": plural({ one: "× {{formattedCount}} gem", other: "× {{formattedCount}} gems" }),
  "whatIfPanel.gemSlots": "Gem slots",
  "whatIfPanel.perSlot": "Per slot",
  "whatIfPanel.title": "What-if: enchants & gems",
});
