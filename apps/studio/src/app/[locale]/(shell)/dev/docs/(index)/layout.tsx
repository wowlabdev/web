import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function DocsIndexLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <PageContainer
      route={routes.dev.docs.index}
      breadcrumbs={breadcrumb(
        routes.home,
        routes.dev.index,
        routes.dev.docs.index,
      )}
    >
      {children}
    </PageContainer>
  );
}
