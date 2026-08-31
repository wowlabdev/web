import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function BibleIndexLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageContainer
      route={routes.dev.bible.index}
      breadcrumbs={breadcrumb(
        routes.home,
        routes.dev.index,
        routes.dev.bible.index,
      )}
    >
      {children}
    </PageContainer>
  );
}
