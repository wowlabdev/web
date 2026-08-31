import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function QuickSimLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <PageContainer
      route={routes.simulate.quick}
      breadcrumbs={breadcrumb(
        routes.home,
        routes.simulate.index,
        routes.simulate.quick,
      )}
    >
      {children}
    </PageContainer>
  );
}
