import type { Metadata } from "next";

import { BlogPostPage } from "@/components/blog";
import { blogSlugs, getBlogPageData, getBlogPost } from "@/lib/content/blog";
import { routes } from "@wowlab/shared/lib/routing";
import { blogPostMetadata } from "@wowlab/shared/lib/seo";

type BlogPostPageRouteProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function BlogPostPageRoute({
  params,
}: Readonly<BlogPostPageRouteProps>) {
  const { slug } = await params;
  const { next, post, prev } = getBlogPageData(slug);

  return <BlogPostPage next={next} post={post} prev={prev} />;
}

export async function generateMetadata({
  params,
}: BlogPostPageRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return blogPostMetadata({
    author: post.author,
    description: post.description,
    host: "landing",
    locale,
    params: { slug },
    parent: routes.blog.index,
    publishedAt: post.publishedAt,
    route: routes.blog.post,
    tag: post.tags?.[0],
    title: post.title,
  });
}

export function generateStaticParams() {
  if (blogSlugs.length === 0) {
    return [{ slug: "_" }];
  }

  return blogSlugs.map((slug) => ({ slug }));
}
