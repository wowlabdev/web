import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function MockBagsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <PageContainer
      route={routes.simulate.mockBags}
      breadcrumbs={breadcrumb(
        routes.home,
        routes.simulate.index,
        routes.simulate.mockBags,
      )}
    >
      {children}
    </PageContainer>
  );
}
