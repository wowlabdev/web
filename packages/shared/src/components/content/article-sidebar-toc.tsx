"use client";

import { useIntlayer } from "next-intlayer";

import type { TocHeading } from "@wowlab/shared/lib/content/toc";

import { cn } from "@wowlab/shared/lib/utils";

import { SidebarSectionLabel } from "./article-sidebar-section-label";

export function ArticleSidebarToc({
  activeId,
  headings,
}: Readonly<{
  headings: TocHeading[];
  activeId: string;
}>) {
  const { contentNav, sidebar: content } = useIntlayer("article");

  if (headings.length === 0) {
    return null;
  }

  return (
    <div>
      <SidebarSectionLabel>{content.onThisPage}</SidebarSectionLabel>
      <nav
        className="flex flex-col gap-1"
        aria-label={contentNav.tocLabel.value}
      >
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              "text-xs py-0.5 leading-snug transition-colors no-underline",
              activeId === heading.id
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
            style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
