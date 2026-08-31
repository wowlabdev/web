import type { ReactNode } from "react";

import { connection } from "next/server";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";
import { requireServerClaims } from "@wowlab/shared/lib/supabase/server";

export default async function DevMcpLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await connection();
  await requireServerClaims();

  return (
    <PageContainer
      route={routes.dev.mcp}
      breadcrumbs={breadcrumb(routes.home, routes.dev.index, routes.dev.mcp)}
    >
      {children}
    </PageContainer>
  );
}
