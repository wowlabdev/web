import { LegalArticle } from "@/components/content/legal-article";
import { legalMetadata } from "@/lib/content/legal";
import { routes } from "@wowlab/shared/lib/routing";

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return legalMetadata("imprint", locale, routes.about.imprint);
}

export default function ImprintPage() {
  return <LegalArticle slug="imprint" />;
}
