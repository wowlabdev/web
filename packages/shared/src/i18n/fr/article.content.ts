import { insert } from "intlayer";

import { fr } from "../i18n";

// prettier-ignore
export default fr("article", {
  // articleMeta — packages/shared/src/components/content/article-meta.tsx
  "articleMeta.minRead": insert("{{count}} min de lecture"),
  // citation — apps/studio/src/components/shared/content/md/md-bibliography.tsx, apps/studio/src/components/shared/content/md/md-cite.tsx
  "citation.accessed": "Consulté le",
  "citation.doi": "DOI",
  "citation.link": "Lien",
  "citation.originalSource": "Source originale",
  "citation.waybackArchive": "Archive Wayback Machine",
  // codePreview — packages/shared/src/components/content/md/md-code/code-preview.tsx
  "codePreview.source": "Source",
  // contentBlock — apps/studio/src/components/shared/content/md/md-content-block.tsx
  "contentBlock.unknownCaption": insert("{{label}} (?) : {{labelLower}} « {{id}} » introuvable"),
  // contentNav — packages/shared/src/components/content/article-sidebar-toc.tsx, packages/shared/src/components/content/content-nav.tsx
  "contentNav.next": "Suivant",
  "contentNav.previous": "Précédent",
  "contentNav.tocLabel": "Table des matières",
  // figure — apps/studio/src/components/shared/content/md/md-figure.tsx
  "figure.label": "Figure",
  "figure.labelLower": "figure",
  // heading — packages/shared/src/components/content/md/md-heading.tsx
  "heading.linkToSection": "Lien vers la section",
  // mermaid — packages/shared/src/components/content/md/md-code/renderers/mermaid-renderer.tsx
  "mermaid.diagram": "Diagramme",
  "mermaid.diagramError": "Erreur de diagramme",
  "mermaid.renderFailed": "Échec du rendu du diagramme",
  // nextSteps — packages/shared/src/components/content/next-steps.tsx
  "nextSteps.title": "Étapes suivantes",
  // roadmap — apps/studio/src/components/shared/content/md/md-roadmap.tsx, apps/studio/src/components/shared/content/md/roadmap/issue-row.tsx, apps/studio/src/components/shared/content/md/roadmap/milestone-progress.tsx +3 more
  "roadmap.closedCount": insert("{{count}} fermées"),
  "roadmap.completed": insert("{{closed}} / {{total}} terminées"),
  "roadmap.due": "Échéance",
  "roadmap.emptyDescription": "Créez des tickets avec le label \"roadmap\" pour remplir cette page.",
  "roadmap.emptyTitle": "Aucun élément de roadmap pour le moment",
  "roadmap.loadFailed": "Échec du chargement des données de la roadmap.",
  "roadmap.noMatchesDescription": "Essayez un autre terme de recherche.",
  "roadmap.noMatchesTitle": "Aucun ticket correspondant",
  "roadmap.openCount": insert("{{count}} ouvertes"),
  "roadmap.searchPlaceholder": "Rechercher des tickets...",
  "roadmap.sort.statusClosedFirst": "Fermés d'abord",
  "roadmap.sort.statusOpenFirst": "Ouverts d'abord",
  "roadmap.sort.titleAsc": "Titre : A-Z",
  "roadmap.sort.titleDesc": "Titre : Z-A",
  "roadmap.sort.updatedNewest": "Mis à jour : plus récents d'abord",
  "roadmap.sort.updatedOldest": "Mis à jour : plus anciens d'abord",
  "roadmap.sortAria": insert("Trier les tickets de la roadmap ({{label}})"),
  "roadmap.sortFallback": "Trier",
  "roadmap.sortIssues": "Trier les tickets",
  "roadmap.sortTitle": insert("Tri : {{label}}"),
  "roadmap.statusDone": "Terminé",
  "roadmap.statusInProgress": "En cours",
  "roadmap.statusOpen": "Ouvert",
  "roadmap.unscheduled": "Non planifié",
  "roadmap.unscheduledDescription": "Tickets non encore assignés à un jalon",
  // sidebar — apps/studio/src/components/shared/content/article-sidebar-search.tsx, packages/shared/src/components/content/article-sidebar-llms-links.tsx, packages/shared/src/components/content/article-sidebar-navigation.tsx +1 more
  "sidebar.copied": "Copié",
  "sidebar.copyMarkdown": "Copier en Markdown",
  "sidebar.editPage": "Modifier cette page",
  "sidebar.forAi": "Pour IA",
  "sidebar.navigation": "Navigation",
  "sidebar.onThisPage": "Sur cette page",
  "sidebar.search": "Rechercher",
  // sidebarMeta — packages/shared/src/components/content/article-sidebar-meta.tsx
  "sidebarMeta.minRead": insert("{{count}} min de lecture"),
  // table — apps/studio/src/components/shared/content/md/md-bible-table.tsx
  "table.label": "Tableau",
  "table.labelLower": "tableau",
  // term — apps/studio/src/components/shared/content/md/md-term.tsx
  "term.docs": "Doc",
});
