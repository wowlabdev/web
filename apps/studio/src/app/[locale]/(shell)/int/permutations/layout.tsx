import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function PermutationsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageContainer
      route={routes.int.permutations}
      breadcrumbs={breadcrumb(routes.home, routes.int.permutations)}
    >
      {children}
    </PageContainer>
  );
}
