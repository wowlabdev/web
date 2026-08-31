import { bible } from "@/lib/content/bible";
import { PageBreadcrumbs } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

type BibleBreadcrumbProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function BibleBreadcrumb({
  params,
}: Readonly<BibleBreadcrumbProps>) {
  const { slug } = await params;
  const { title } = await bible.getPageData(slug);

  return (
    <PageBreadcrumbs
      items={breadcrumb(routes.home, routes.dev.bible.index, title)}
    />
  );
}
