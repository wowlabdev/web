import { ArticleJsonLd } from "next-seo";

import type { BlogPost } from "@/lib/content/blog";
import type { NavItem } from "@wowlab/shared/lib/content/types";

import { ArticleSidebar } from "@wowlab/shared/components/content/article-sidebar";
import { ContentArticle } from "@wowlab/shared/components/content/content-article";
import { ContentNav } from "@wowlab/shared/components/content/content-nav";
import { MdxContent } from "@wowlab/shared/components/content/mdx-content";
import { href, landingUrl, routes } from "@wowlab/shared/lib/routing";
import { SITE_NAME } from "@wowlab/shared/lib/seo";

import { BlogPostHeader } from "./blog-post-header";

type BlogPostPageProps = {
  next: NavItem;
  post: BlogPost;
  prev: NavItem;
};

export function BlogPostPage({
  next,
  post,
  prev,
}: Readonly<BlogPostPageProps>) {
  return (
    <>
      <ArticleJsonLd
        author={post.author || SITE_NAME}
        datePublished={post.publishedAt}
        description={post.description}
        headline={post.title}
        isAccessibleForFree
        type="BlogPosting"
        url={landingUrl(
          href(routes.blog.post, { slug: post.slug.replace(/^blog\//, "") }),
        )}
      />
      <div className="flex gap-8 py-4">
        <div className="min-w-0 flex-1 mx-auto max-w-3xl">
          <ContentArticle
            footer={<ContentNav prev={prev} next={next} shouldShowSubtitle />}
          >
            <BlogPostHeader
              author={post.author}
              description={post.description}
              publishedAt={post.publishedAt}
              readingTime={post.metadata.readingTime}
              tags={post.tags}
              title={post.title}
            />
            <MdxContent code={post.body} />
          </ContentArticle>
        </div>

        <ArticleSidebar toc={post.toc} />
      </div>
    </>
  );
}
