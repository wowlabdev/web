import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function RankingsSpecsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageContainer
      route={routes.rankings.specs}
      breadcrumbs={breadcrumb(
        routes.home,
        routes.rankings.index,
        routes.rankings.specs,
      )}
    >
      {children}
    </PageContainer>
  );
}
