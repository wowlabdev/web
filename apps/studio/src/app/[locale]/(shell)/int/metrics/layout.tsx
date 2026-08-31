import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function DevMetricsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageContainer
      route={routes.int.metrics}
      breadcrumbs={breadcrumb(routes.home, routes.int.metrics)}
    >
      {children}
    </PageContainer>
  );
}
