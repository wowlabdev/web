import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";
import { routes } from "@wowlab/shared/lib/routing";
import { sectionMetadata, SITE_NAME } from "@wowlab/shared/lib/seo";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return sectionMetadata({
    host: "landing",
    locale,
    route: routes.home,
    title: SITE_NAME,
  });
}

export default function LandingPageRoute() {
  return <LandingPage />;
}
