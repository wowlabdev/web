import { InspectIndexPage } from "@/components/shared/inspect";
import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function InspectRoute() {
  return (
    <PageContainer breadcrumbs={breadcrumb(routes.home, routes.inspect.index)}>
      <InspectIndexPage />
    </PageContainer>
  );
}
