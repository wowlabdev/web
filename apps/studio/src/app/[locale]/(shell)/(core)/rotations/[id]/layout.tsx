import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function RotationViewLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageContainer
      breadcrumbs={breadcrumb(
        routes.home,
        routes.rotations.index,
        routes.rotations.browse,
        "View",
      )}
    >
      {children}
    </PageContainer>
  );
}
