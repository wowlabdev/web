import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";
import { routes } from "@wowlab/shared/lib/routing";
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
    route: routes.home,
    title: "Studio",
  });
}

export default function HomeLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <PageContainer>{children}</PageContainer>;
}
