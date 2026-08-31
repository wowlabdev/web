import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function DevUiLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <PageContainer
      route={routes.int.ui}
      breadcrumbs={breadcrumb(routes.home, routes.int.ui)}
    >
      {children}
    </PageContainer>
  );
}
