import { legal } from "@/lib/content/legal";
import { ArticleHeader } from "@wowlab/shared/components/content/article-header";
import { ArticleMeta } from "@wowlab/shared/components/content/article-meta";
import { ContentArticle } from "@wowlab/shared/components/content/content-article";
import { MdxContent } from "@wowlab/shared/components/content/mdx-content";

type LegalArticleProps = {
  slug: string;
};

export function LegalArticle({ slug }: Readonly<LegalArticleProps>) {
  const page = legal.getPageData(slug);

  return (
    <ContentArticle>
      <ArticleHeader title={page.title} description={page.description}>
        <ArticleMeta date={page.updatedAt} />
      </ArticleHeader>
      <MdxContent code={page.body} />
    </ContentArticle>
  );
}
