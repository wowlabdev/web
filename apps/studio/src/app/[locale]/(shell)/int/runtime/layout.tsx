import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function RuntimeLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <PageContainer
      route={routes.int.runtime}
      breadcrumbs={breadcrumb(routes.home, routes.int.runtime)}
    >
      {children}
    </PageContainer>
  );
}
