import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function RotationsIndexLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageContainer
      route={routes.rotations.index}
      breadcrumbs={breadcrumb(routes.home, routes.rotations.index)}
    >
      {children}
    </PageContainer>
  );
}
