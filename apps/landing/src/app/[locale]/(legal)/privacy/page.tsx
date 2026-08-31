import { LegalArticle } from "@/components/content/legal-article";
import { legalMetadata } from "@/lib/content/legal";
import { routes } from "@wowlab/shared/lib/routing";

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return legalMetadata("privacy", locale, routes.about.privacy);
}

export default function PrivacyPage() {
  return <LegalArticle slug="privacy" />;
}
