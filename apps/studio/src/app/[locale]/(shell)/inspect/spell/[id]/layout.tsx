import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";

export default function InspectSpellLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageContainer
      breadcrumbs={breadcrumb(routes.home, routes.inspect.index, "Spell")}
    >
      {children}
    </PageContainer>
  );
}
