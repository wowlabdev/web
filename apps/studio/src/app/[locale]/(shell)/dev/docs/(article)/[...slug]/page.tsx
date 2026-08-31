import { createArticlePage } from "@/lib/content/article-page";
import { docs } from "@/lib/content/docs";
import { routes } from "@wowlab/shared/lib/routing";

const article = createArticlePage({
  collection: docs,
  parent: routes.dev.docs.index,
  route: routes.dev.docs.page,
  source: "docs",
});

export default article.Page;
export const generateMetadata = article.generateMetadata;
export const generateStaticParams = article.generateStaticParams;
