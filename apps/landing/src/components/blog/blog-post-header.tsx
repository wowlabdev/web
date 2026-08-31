import { ArticleHeader } from "@wowlab/shared/components/content/article-header";
import { ArticleMeta } from "@wowlab/shared/components/content/article-meta";
import { Badge } from "@wowlab/shared/components/ui/badge";

export type BlogPostHeaderProps = {
  tags?: string[];
  title: string;
  description?: string;
  author?: string;
  publishedAt?: string;
  readingTime?: number;
};

export function BlogPostHeader({
  author,
  description,
  publishedAt,
  readingTime,
  tags,
  title,
}: Readonly<BlogPostHeaderProps>) {
  return (
    <ArticleHeader
      title={title}
      description={description}
      descriptionClassName="md:text-xl"
      beforeTitle={
        tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null
      }
    >
      <ArticleMeta
        date={publishedAt}
        author={author}
        readingTime={readingTime}
      />
    </ArticleHeader>
  );
}
