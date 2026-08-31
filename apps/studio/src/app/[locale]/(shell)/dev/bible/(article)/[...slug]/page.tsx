import { createArticlePage } from "@/lib/content/article-page";
import { bible } from "@/lib/content/bible";
import { routes } from "@wowlab/shared/lib/routing";

const article = createArticlePage({
  collection: bible,
  parent: routes.dev.bible.index,
  route: routes.dev.bible.page,
  source: "bible",
});

export default article.Page;
export const generateMetadata = article.generateMetadata;
export const generateStaticParams = article.generateStaticParams;
