import type { Metadata } from "next";

import { RankingsSpecsPage } from "@/components/core/rankings";
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
    route: routes.rankings.specs,
  });
}

export default function RankingsSpecsRoute() {
  return <RankingsSpecsPage />;
}
