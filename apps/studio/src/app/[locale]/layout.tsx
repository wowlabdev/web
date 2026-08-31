import type { NextLayoutIntlayer } from "next-intlayer";

import { IntlayerProvider } from "next-intlayer/server";
import { notFound } from "next/navigation";

import {
  AuthEventsIsland,
  QueryIsland,
  ThemeIsland,
  WasmPanicIsland,
} from "@/components/shared/islands";
import { ErrorBoundary } from "@wowlab/shared/components/error-boundary";
import { Toaster } from "@wowlab/shared/components/ui/sonner";
import { LOCALES } from "@wowlab/shared/lib/seo";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const LocaleLayout: NextLayoutIntlayer = async ({ children, params }) => {
  const { locale } = await params;

  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) {
    notFound();
  }

  return (
    <IntlayerProvider locale={locale}>
      <ThemeIsland
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ErrorBoundary>
          <QueryIsland>
            <AuthEventsIsland>{children}</AuthEventsIsland>
          </QueryIsland>
        </ErrorBoundary>
        <WasmPanicIsland />
        <Toaster />
      </ThemeIsland>
    </IntlayerProvider>
  );
};

export default LocaleLayout;
