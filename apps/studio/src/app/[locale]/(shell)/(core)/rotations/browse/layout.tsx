import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, routes } from "@wowlab/shared/lib/routing";
import { sectionMetadata } from "@wowlab/shared/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return sectionMetadata({
    host: "app",
    locale,
    route: routes.rotations.browse,
  });
}

export default function RotationsBrowseLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageContainer
      route={routes.rotations.browse}
      breadcrumbs={breadcrumb(
        routes.home,
        routes.rotations.index,
        routes.rotations.browse,
      )}
    >
      {children}
    </PageContainer>
  );
}
