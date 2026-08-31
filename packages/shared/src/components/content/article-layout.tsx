import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

import { ArticleJsonLd } from "next-seo";

import type {
  ContentSection,
  NavItem,
  TocEntry,
} from "@wowlab/shared/lib/content";
import type { DynamicRoute } from "@wowlab/shared/lib/routing/types";

import { appUrl, href } from "@wowlab/shared/lib/routing";
import { SITE_NAME } from "@wowlab/shared/lib/seo";

import { ArticleMeta } from "./article-meta";
import { ArticleSidebar } from "./article-sidebar";
import { ContentArticle } from "./content-article";
import { ContentNav } from "./content-nav";
import { MdxContent } from "./mdx-content";
import { NextSteps } from "./next-steps";

type ArticleLayoutProps = {
  body: string;
  description: string;
  editUrl?: string;
  fullSlug: string;
  mdxComponents?: MDXComponents;
  metadata: { readingTime?: number; wordCount?: number };
  navItems: ContentSection[];
  next: NavItem;
  nextSteps: NonNullable<NavItem>[];
  pageRoute: DynamicRoute;
  prev: NavItem;
  raw?: string;
  searchSlot?: ReactNode;
  title: string;
  toc: TocEntry[];
  updatedAt: string;
};

export function ArticleLayout({
  body,
  description,
  editUrl,
  fullSlug,
  mdxComponents,
  metadata,
  navItems,
  next,
  nextSteps,
  pageRoute,
  prev,
  raw,
  searchSlot,
  title,
  toc,
  updatedAt,
}: Readonly<ArticleLayoutProps>) {
  const pageUrl = appUrl(href(pageRoute, { slug: fullSlug }));

  return (
    <>
      <ArticleJsonLd
        url={pageUrl}
        headline={title}
        description={description}
        datePublished={updatedAt}
        dateModified={updatedAt}
        author={{ "@type": "Organization", name: SITE_NAME }}
        isAccessibleForFree
      />
      <div className="flex gap-8">
        <div className="min-w-0 flex-1 max-w-3xl">
          <ContentArticle footer={<ContentNav prev={prev} next={next} />}>
            <div className="mb-8 flex flex-col items-start gap-3">
              <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
              {description && (
                <p className="-mt-1 text-muted-foreground">{description}</p>
              )}
              <ArticleMeta
                date={updatedAt}
                readingTime={metadata.readingTime}
              />
            </div>
            <MdxContent code={body} components={mdxComponents} />
            <NextSteps items={nextSteps} />
          </ContentArticle>
        </div>

        <ArticleSidebar
          toc={toc}
          hasLlmsLinks
          pageActions={{ editUrl, raw }}
          searchSlot={searchSlot}
          nav={{
            currentSlug: fullSlug,
            items: navItems,
            pageRoute,
          }}
        />
      </div>
    </>
  );
}
