import { insert } from "intlayer";

import { de } from "../i18n";

// prettier-ignore
export default de("article", {
  // articleMeta — packages/shared/src/components/content/article-meta.tsx
  "articleMeta.minRead": insert("{{count}} Min. Lesezeit"),
  // citation — apps/studio/src/components/shared/content/md/md-bibliography.tsx, apps/studio/src/components/shared/content/md/md-cite.tsx
  "citation.accessed": "Abgerufen",
  "citation.doi": "DOI",
  "citation.link": "Link",
  "citation.originalSource": "Originalquelle",
  "citation.waybackArchive": "Wayback-Machine-Archiv",
  // codePreview — packages/shared/src/components/content/md/md-code/code-preview.tsx
  "codePreview.source": "Quelle",
  // contentBlock — apps/studio/src/components/shared/content/md/md-content-block.tsx
  "contentBlock.unknownCaption": insert("{{label}} (?): Unbekannte {{labelLower}} \"{{id}}\""),
  // contentNav — packages/shared/src/components/content/article-sidebar-toc.tsx, packages/shared/src/components/content/content-nav.tsx
  "contentNav.next": "Weiter",
  "contentNav.previous": "Zurück",
  "contentNav.tocLabel": "Inhaltsverzeichnis",
  // figure — apps/studio/src/components/shared/content/md/md-figure.tsx
  "figure.label": "Abbildung",
  "figure.labelLower": "Abbildung",
  // heading — packages/shared/src/components/content/md/md-heading.tsx
  "heading.linkToSection": "Link zum Abschnitt",
  // mermaid — packages/shared/src/components/content/md/md-code/renderers/mermaid-renderer.tsx
  "mermaid.diagram": "Diagramm",
  "mermaid.diagramError": "Diagrammfehler",
  "mermaid.renderFailed": "Diagramm konnte nicht gerendert werden",
  // nextSteps — packages/shared/src/components/content/next-steps.tsx
  "nextSteps.title": "Nächste Schritte",
  // roadmap — apps/studio/src/components/shared/content/md/md-roadmap.tsx, apps/studio/src/components/shared/content/md/roadmap/issue-row.tsx, apps/studio/src/components/shared/content/md/roadmap/milestone-progress.tsx +3 more
  "roadmap.closedCount": insert("{{count}} geschlossen"),
  "roadmap.completed": insert("{{closed}} / {{total}} abgeschlossen"),
  "roadmap.due": "Fällig",
  "roadmap.emptyDescription": "Erstelle Issues mit dem Label \"roadmap\", um diese Seite zu füllen.",
  "roadmap.emptyTitle": "Noch keine Roadmap-Einträge",
  "roadmap.loadFailed": "Roadmap-Daten konnten nicht geladen werden.",
  "roadmap.noMatchesDescription": "Versuche einen anderen Suchbegriff.",
  "roadmap.noMatchesTitle": "Keine passenden Issues",
  "roadmap.openCount": insert("{{count}} offen"),
  "roadmap.searchPlaceholder": "Issues suchen...",
  "roadmap.sort.statusClosedFirst": "Geschlossene zuerst",
  "roadmap.sort.statusOpenFirst": "Offene zuerst",
  "roadmap.sort.titleAsc": "Titel: A-Z",
  "roadmap.sort.titleDesc": "Titel: Z-A",
  "roadmap.sort.updatedNewest": "Aktualisiert: neueste zuerst",
  "roadmap.sort.updatedOldest": "Aktualisiert: älteste zuerst",
  "roadmap.sortAria": insert("Roadmap-Issues sortieren ({{label}})"),
  "roadmap.sortFallback": "Sortieren",
  "roadmap.sortIssues": "Issues sortieren",
  "roadmap.sortTitle": insert("Sortierung: {{label}}"),
  "roadmap.statusDone": "Erledigt",
  "roadmap.statusInProgress": "In Arbeit",
  "roadmap.statusOpen": "Offen",
  "roadmap.unscheduled": "Nicht geplant",
  "roadmap.unscheduledDescription": "Issues, die noch keinem Meilenstein zugeordnet sind",
  // sidebar — apps/studio/src/components/shared/content/article-sidebar-search.tsx, packages/shared/src/components/content/article-sidebar-llms-links.tsx, packages/shared/src/components/content/article-sidebar-navigation.tsx +1 more
  "sidebar.copied": "Kopiert",
  "sidebar.copyMarkdown": "Als Markdown kopieren",
  "sidebar.editPage": "Diese Seite bearbeiten",
  "sidebar.forAi": "Für KI",
  "sidebar.navigation": "Navigation",
  "sidebar.onThisPage": "Auf dieser Seite",
  "sidebar.search": "Suche",
  // sidebarMeta — packages/shared/src/components/content/article-sidebar-meta.tsx
  "sidebarMeta.minRead": insert("{{count}} Min. Lesezeit"),
  // table — apps/studio/src/components/shared/content/md/md-bible-table.tsx
  "table.label": "Tabelle",
  "table.labelLower": "Tabelle",
  // term — apps/studio/src/components/shared/content/md/md-term.tsx
  "term.docs": "Doku",
});
