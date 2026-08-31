"use client";

import type { ReactNode } from "react";

import type { ContentSection, TocEntry } from "@wowlab/shared/lib/content";
import type { DynamicRoute } from "@wowlab/shared/lib/routing/types";

import { useActiveHeading } from "@wowlab/shared/hooks/use-active-heading";
import { flattenToc } from "@wowlab/shared/lib/content/toc";
import { routes } from "@wowlab/shared/lib/routing";

import { ArticleSidebarLlmsLinks } from "./article-sidebar-llms-links";
import {
  type ArticleMetaInfo,
  ArticleSidebarMeta,
} from "./article-sidebar-meta";
import { ArticleSidebarNavigation } from "./article-sidebar-navigation";
import { ArticleSidebarToc } from "./article-sidebar-toc";

type ArticleSidebarProps = {
  hasLlmsLinks?: boolean;
  pageActions?: {
    editUrl?: string;
    raw?: string;
  };
  searchSlot?: ReactNode;
  toc?: TocEntry[];
  meta?: ArticleMetaInfo;
  nav?: {
    items: ContentSection[];
    currentSlug: string;
    pageRoute?: DynamicRoute;
  };
};

export function ArticleSidebar({
  hasLlmsLinks,
  meta,
  nav,
  pageActions,
  searchSlot,
  toc,
}: Readonly<ArticleSidebarProps>) {
  const headings = flattenToc(toc ?? []);
  const headingIds = headings.map((h) => h.id);
  const activeId = useActiveHeading(headingIds);

  const hasMeta = meta && (meta.date || meta.readingTime);
  const hasToc = headings.length > 0;
  const hasNav = nav && nav.items.length > 0;

  if (!hasMeta && !hasToc && !hasNav) {
    return null;
  }

  return (
    <aside className="hidden xl:block w-52 shrink-0">
      <div className="sticky top-24 flex flex-col gap-6 border-l border-border pl-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
        {hasNav && searchSlot}
        {hasMeta ? <ArticleSidebarMeta meta={meta} /> : null}
        {hasNav && (
          <ArticleSidebarNavigation
            items={nav.items}
            currentSlug={nav.currentSlug}
            pageRoute={nav.pageRoute ?? routes.dev.docs.page}
          />
        )}
        {hasToc && (
          <ArticleSidebarToc headings={headings} activeId={activeId} />
        )}
        {hasLlmsLinks && (
          <ArticleSidebarLlmsLinks
            editUrl={pageActions?.editUrl}
            raw={pageActions?.raw}
          />
        )}
      </div>
    </aside>
  );
}
