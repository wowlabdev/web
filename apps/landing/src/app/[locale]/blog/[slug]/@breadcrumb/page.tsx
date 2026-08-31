import { getBlogPageData } from "@/lib/content/blog";
import { PageBreadcrumbs } from "@wowlab/shared/components/common/page-breadcrumbs";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

type BlogBreadcrumbProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogBreadcrumb({
  params,
}: Readonly<BlogBreadcrumbProps>) {
  const { slug } = await params;
  const { post } = getBlogPageData(slug);

  return (
    <PageBreadcrumbs
      items={breadcrumb(routes.home, routes.blog.index, post.title)}
    />
  );
}
