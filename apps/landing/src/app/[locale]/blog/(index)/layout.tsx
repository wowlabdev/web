import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Rss } from "lucide-react";
import { useIntlayer } from "next-intlayer/server";

import { PageContainer } from "@wowlab/shared/components/common/page-container";
import { Button } from "@wowlab/shared/components/ui/button";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";
import { sectionMetadata } from "@wowlab/shared/lib/seo";

const FEED_URL = "/blog/feed.xml";

export default function BlogIndexLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <BlogIndexLayoutContent>{children}</BlogIndexLayoutContent>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const base = sectionMetadata({
    host: "landing",
    locale,
    route: routes.blog.index,
  });

  return {
    ...base,
    alternates: {
      ...base.alternates,
      types: { "application/rss+xml": FEED_URL },
    },
  };
}

function BlogIndexLayoutContent({
  children,
}: Readonly<{ children: ReactNode }>) {
  const content = useIntlayer("blog");

  return (
    <PageContainer
      host="landing"
      route={routes.blog.index}
      breadcrumbs={breadcrumb(routes.home, routes.blog.index)}
      headerActions={
        <Button variant="outline" size="icon-sm" asChild>
          <a
            href={FEED_URL}
            target="_blank"
            aria-label={content.rssFeedAriaLabel.value}
          >
            <Rss className="size-4" />
          </a>
        </Button>
      }
    >
      {children}
    </PageContainer>
  );
}
