import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function PlanTraitsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageContainer
      route={routes.plan.traits}
      breadcrumbs={breadcrumb(
        routes.home,
        routes.plan.index,
        routes.plan.traits,
      )}
    >
      {children}
    </PageContainer>
  );
}
