import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function DevHooksLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <PageContainer
      route={routes.int.hooks}
      breadcrumbs={breadcrumb(routes.home, routes.int.hooks)}
    >
      {children}
    </PageContainer>
  );
}
