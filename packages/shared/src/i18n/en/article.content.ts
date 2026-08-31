import { insert } from "intlayer";

import { en } from "../i18n";

// prettier-ignore
export default en("article", {
  // articleMeta — packages/shared/src/components/content/article-meta.tsx
  "articleMeta.minRead": insert("{{count}} min read"),
  // citation — apps/studio/src/components/shared/content/md/md-bibliography.tsx, apps/studio/src/components/shared/content/md/md-cite.tsx
  "citation.accessed": "Accessed",
  "citation.doi": "DOI",
  "citation.link": "Link",
  "citation.originalSource": "Original source",
  "citation.waybackArchive": "Wayback Machine archive",
  // codePreview — packages/shared/src/components/content/md/md-code/code-preview.tsx
  "codePreview.source": "Source",
  // contentBlock — apps/studio/src/components/shared/content/md/md-content-block.tsx
  "contentBlock.unknownCaption": insert("{{label}} (?): Unknown {{labelLower}} \"{{id}}\""),
  // contentNav — packages/shared/src/components/content/article-sidebar-toc.tsx, packages/shared/src/components/content/content-nav.tsx
  "contentNav.next": "Next",
  "contentNav.previous": "Previous",
  "contentNav.tocLabel": "Table of contents",
  // figure — apps/studio/src/components/shared/content/md/md-figure.tsx
  "figure.label": "Figure",
  "figure.labelLower": "figure",
  // heading — packages/shared/src/components/content/md/md-heading.tsx
  "heading.linkToSection": "Link to section",
  // mermaid — packages/shared/src/components/content/md/md-code/renderers/mermaid-renderer.tsx
  "mermaid.diagram": "Diagram",
  "mermaid.diagramError": "Diagram Error",
  "mermaid.renderFailed": "Failed to render diagram",
  // nextSteps — packages/shared/src/components/content/next-steps.tsx
  "nextSteps.title": "Next steps",
  // roadmap — apps/studio/src/components/shared/content/md/md-roadmap.tsx, apps/studio/src/components/shared/content/md/roadmap/issue-row.tsx, apps/studio/src/components/shared/content/md/roadmap/milestone-progress.tsx +3 more
  "roadmap.closedCount": insert("{{count}} closed"),
  "roadmap.completed": insert("{{closed}} / {{total}} completed"),
  "roadmap.due": "Due",
  "roadmap.emptyDescription": "Create issues with the \"roadmap\" label to populate this page.",
  "roadmap.emptyTitle": "No roadmap items yet",
  "roadmap.loadFailed": "Failed to load roadmap data.",
  "roadmap.noMatchesDescription": "Try a different search term.",
  "roadmap.noMatchesTitle": "No matching issues",
  "roadmap.openCount": insert("{{count}} open"),
  "roadmap.searchPlaceholder": "Search issues...",
  "roadmap.sort.statusClosedFirst": "Closed first",
  "roadmap.sort.statusOpenFirst": "Open first",
  "roadmap.sort.titleAsc": "Title: A-Z",
  "roadmap.sort.titleDesc": "Title: Z-A",
  "roadmap.sort.updatedNewest": "Updated: newest first",
  "roadmap.sort.updatedOldest": "Updated: oldest first",
  "roadmap.sortAria": insert("Sort roadmap issues ({{label}})"),
  "roadmap.sortFallback": "Sort",
  "roadmap.sortIssues": "Sort issues",
  "roadmap.sortTitle": insert("Sort: {{label}}"),
  "roadmap.statusDone": "Done",
  "roadmap.statusInProgress": "In Progress",
  "roadmap.statusOpen": "Open",
  "roadmap.unscheduled": "Unscheduled",
  "roadmap.unscheduledDescription": "Issues not yet assigned to a milestone",
  // sidebar — apps/studio/src/components/shared/content/article-sidebar-search.tsx, packages/shared/src/components/content/article-sidebar-llms-links.tsx, packages/shared/src/components/content/article-sidebar-navigation.tsx +1 more
  "sidebar.copied": "Copied",
  "sidebar.copyMarkdown": "Copy as Markdown",
  "sidebar.editPage": "Edit this page",
  "sidebar.forAi": "For AI",
  "sidebar.navigation": "Navigation",
  "sidebar.onThisPage": "On this page",
  "sidebar.search": "Search",
  // sidebarMeta — packages/shared/src/components/content/article-sidebar-meta.tsx
  "sidebarMeta.minRead": insert("{{count}} min read"),
  // table — apps/studio/src/components/shared/content/md/md-bible-table.tsx
  "table.label": "Table",
  "table.labelLower": "table",
  // term — apps/studio/src/components/shared/content/md/md-term.tsx
  "term.docs": "Docs",
});
