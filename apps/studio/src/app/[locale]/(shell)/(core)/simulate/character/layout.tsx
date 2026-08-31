import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function CharacterLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageContainer
      route={routes.simulate.character}
      breadcrumbs={breadcrumb(
        routes.home,
        routes.simulate.index,
        routes.simulate.character,
      )}
    >
      {children}
    </PageContainer>
  );
}
