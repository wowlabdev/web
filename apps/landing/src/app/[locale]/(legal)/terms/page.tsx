import { LegalArticle } from "@/components/content/legal-article";
import { legalMetadata } from "@/lib/content/legal";
import { routes } from "@wowlab/shared/lib/routing";

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return legalMetadata("terms", locale, routes.about.terms);
}

export default function TermsPage() {
  return <LegalArticle slug="terms" />;
}
