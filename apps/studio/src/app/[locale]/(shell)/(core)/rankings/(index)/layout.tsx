import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function RankingsIndexLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageContainer
      route={routes.rankings.index}
      breadcrumbs={breadcrumb(routes.home, routes.rankings.index)}
    >
      {children}
    </PageContainer>
  );
}
