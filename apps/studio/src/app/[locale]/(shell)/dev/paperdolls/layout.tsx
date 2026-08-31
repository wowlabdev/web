import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function DevPaperdollsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <PageContainer
      route={routes.dev.paperdolls}
      breadcrumbs={breadcrumb(
        routes.home,
        routes.dev.index,
        routes.dev.paperdolls,
      )}
      maxW="5xl"
    >
      {children}
    </PageContainer>
  );
}
