import type { Metadata } from "next";
import type { ReactNode } from "react";

import { routes } from "@wowlab/shared/lib/routing";
import { sectionMetadata } from "@wowlab/shared/lib/seo";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return children;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return sectionMetadata({
    host: "app",
    locale,
    route: routes.dev.docs.index,
  });
}
