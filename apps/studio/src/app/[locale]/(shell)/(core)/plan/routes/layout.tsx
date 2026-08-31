import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function PlanRoutesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageContainer
      route={routes.plan.routes}
      breadcrumbs={breadcrumb(
        routes.home,
        routes.plan.index,
        routes.plan.routes,
      )}
    >
      {children}
    </PageContainer>
  );
}
