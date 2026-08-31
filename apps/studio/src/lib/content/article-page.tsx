import type { Metadata } from "next";

import type { DynamicRoute, Route } from "@wowlab/shared/lib/routing";

import { studioMdxComponents } from "@/components/shared/content-ext/studio-mdx-components";
import { ArticleSidebarSearch } from "@/components/shared/content/article-sidebar-search";
import { ArticleLayout } from "@wowlab/shared/components/content/article-layout";
import { makeContentSourceUrl } from "@wowlab/shared/lib/links";
import { articleMetadata } from "@wowlab/shared/lib/seo";

import type { docs } from "./docs";

type ArticleCollection = Pick<
  typeof docs,
  "getEntry" | "getPageData" | "index" | "slugs"
>;

type ArticlePageConfig = {
  collection: ArticleCollection;
  parent: Route;
  route: DynamicRoute;
  source: "bible" | "docs";
};

type ArticlePageProps = {
  params: Promise<{ locale: string; slug: string[] }>;
};

export function createArticlePage({
  collection,
  parent,
  route,
  source,
}: ArticlePageConfig) {
  async function Page({ params }: Readonly<ArticlePageProps>) {
    const { slug } = await params;
    const page = await collection.getPageData(slug);

    return (
      <ArticleLayout
        body={page.body}
        description={page.description}
        editUrl={makeContentSourceUrl(source, page.sortKey)}
        fullSlug={page.fullSlug}
        mdxComponents={studioMdxComponents}
        metadata={page.metadata}
        navItems={collection.index}
        next={page.next}
        nextSteps={page.nextSteps}
        pageRoute={route}
        prev={page.prev}
        raw={page.raw}
        searchSlot={<ArticleSidebarSearch />}
        title={page.title}
        toc={page.toc}
        updatedAt={page.updatedAt}
      />
    );
  }

  async function generateMetadata({
    params,
  }: ArticlePageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const fullSlug = slug.join("/");
    const entry = collection.getEntry(fullSlug);

    if (!entry) {
      return {};
    }

    return articleMetadata({
      description: entry.description,
      host: "app",
      locale,
      params: { slug: fullSlug },
      parent,
      route,
      title: entry.title,
      updatedAt: entry.updatedAt,
    });
  }

  function generateStaticParams() {
    return collection.slugs.map((slug) => ({ slug: slug.split("/") }));
  }

  return { generateMetadata, generateStaticParams, Page };
}
