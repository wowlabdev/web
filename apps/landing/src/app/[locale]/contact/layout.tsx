import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common/page-container";
import { routes } from "@wowlab/shared/lib/routing";
import { sectionMetadata } from "@wowlab/shared/lib/seo";

export default function ContactLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <PageContainer maxW="4xl">{children}</PageContainer>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return sectionMetadata({
    host: "landing",
    locale,
    route: routes.about.contact,
  });
}
