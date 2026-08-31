import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function DevAddonLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <PageContainer
      route={routes.dev.addon}
      breadcrumbs={breadcrumb(routes.home, routes.dev.index, routes.dev.addon)}
      maxW="5xl"
    >
      {children}
    </PageContainer>
  );
}
