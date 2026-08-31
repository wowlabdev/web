import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function RankingsItemsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageContainer
      route={routes.rankings.items}
      breadcrumbs={breadcrumb(
        routes.home,
        routes.rankings.index,
        routes.rankings.items,
      )}
    >
      {children}
    </PageContainer>
  );
}
