"use client";

import { useIntlayer } from "next-intlayer";
import { useDate } from "next-intlayer/format";

import type { BlogPost } from "@/lib/content/blog";

import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@wowlab/shared/components/ui/item";
import { Link } from "@wowlab/shared/components/ui/link";
import { href, routes } from "@wowlab/shared/lib/routing";

type BlogListProps = {
  posts: BlogPost[];
};

export function BlogList({ posts }: Readonly<BlogListProps>) {
  const { blogList: content } = useIntlayer("blog");
  const formatDate = useDate();

  if (posts.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        {content.noPostsYet}
      </p>
    );
  }

  return (
    <ItemGroup className="divide-y divide-border/60 border-y border-border/60">
      {posts.map((post) => {
        const slug = post.slug.replace(/^blog\//, "");
        const date = new Date(post.publishedAt);

        return (
          <Item
            key={slug}
            asChild
            className="group grid gap-x-8 gap-y-2 rounded-none p-0 py-6 transition-colors sm:grid-cols-[9rem_1fr] sm:py-7"
          >
            <Link
              href={href(routes.blog.post, { slug })}
              className="no-underline hover:bg-muted/40"
            >
              <ItemMedia className="justify-start text-xs font-medium uppercase tracking-wider tabular-nums text-muted-foreground sm:pt-1">
                <time dateTime={date.toISOString()}>
                  {formatDate(date, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </ItemMedia>

              <ItemContent className="space-y-1.5">
                <ItemTitle className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
                  {post.title}
                </ItemTitle>
                {post.description && (
                  <ItemDescription className="text-sm text-muted-foreground sm:text-base">
                    {post.description}
                  </ItemDescription>
                )}
                {post.tags && post.tags.length > 0 && (
                  <ItemActions className="flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] font-medium uppercase tracking-wide"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </ItemActions>
                )}
              </ItemContent>
            </Link>
          </Item>
        );
      })}
    </ItemGroup>
  );
}
