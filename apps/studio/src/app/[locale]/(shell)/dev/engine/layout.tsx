import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function DevEngineLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <PageContainer
      route={routes.dev.engine}
      breadcrumbs={breadcrumb(routes.home, routes.dev.index, routes.dev.engine)}
    >
      {children}
    </PageContainer>
  );
}
