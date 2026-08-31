import { PageBreadcrumbs } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

type UserProfileBreadcrumbProps = {
  params: Promise<{ handle: string }>;
};

export default async function UserProfileBreadcrumb({
  params,
}: Readonly<UserProfileBreadcrumbProps>) {
  const { handle } = await params;

  return <PageBreadcrumbs items={breadcrumb(routes.home, `@${handle}`)} />;
}
