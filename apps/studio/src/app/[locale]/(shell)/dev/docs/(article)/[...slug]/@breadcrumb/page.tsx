import { docs } from "@/lib/content/docs";
import { PageBreadcrumbs } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

type DocBreadcrumbProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function DocBreadcrumb({
  params,
}: Readonly<DocBreadcrumbProps>) {
  const { slug } = await params;
  const { title } = await docs.getPageData(slug);

  return (
    <PageBreadcrumbs
      items={breadcrumb(routes.home, routes.dev.docs.index, title)}
    />
  );
}
