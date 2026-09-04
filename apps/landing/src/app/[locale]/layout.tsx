import type { NextLayoutIntlayer } from "next-intlayer";
import type { ReactNode } from "react";

import { IntlayerProvider, useIntlayer } from "next-intlayer/server";
import { notFound } from "next/navigation";

import { LandingHeader } from "@/components/landing/landing-header";
import {
  CookieConsentMount,
  CookieSettingsTrigger,
} from "@wowlab/shared/components/cookie-consent";
import { LanguageDropdown } from "@wowlab/shared/components/layout/language-dropdown";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@wowlab/shared/components/ui/hover-card";
import { Link } from "@wowlab/shared/components/ui/link";
import { Toaster } from "@wowlab/shared/components/ui/sonner";
import { env } from "@wowlab/shared/lib/env";
import {
  GITHUB_ORGANIZATION_URL,
  href,
  routes,
} from "@wowlab/shared/lib/routing";
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
      <LandingChrome>{children}</LandingChrome>
      <Toaster theme="dark" />
      <CookieConsentMount />
    </IntlayerProvider>
  );
};

export default LocaleLayout;

function LandingChrome({ children }: Readonly<{ children: ReactNode }>) {
  const content = useIntlayer("landingLayout");

  return (
    <div className="dark relative flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_32rem),radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--destructive)_16%,transparent),transparent_28rem)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-primary/10 to-transparent" />
      <LandingHeader
        navPricing={content.navPricing}
        navBlog={content.navBlog}
        navLaunchApp={content.navLaunchApp}
      />

      <main className="relative z-10 flex-1">{children}</main>

      <footer className="relative z-10 border-t border-white/10 bg-background/75 backdrop-blur">
        <div className="text-muted-foreground mx-auto flex max-w-7xl justify-end px-4 py-6 text-xs sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
            <HoverCard openDelay={100} closeDelay={150}>
              <HoverCardTrigger className="hover:text-foreground">
                {content.footerConnect}
              </HoverCardTrigger>
              <HoverCardContent align="end" side="top" className="w-fit">
                <div className="flex flex-col gap-1.5">
                  <Link
                    href={href(routes.about.contact)}
                    className="hover:text-foreground"
                  >
                    {content.footerContact}
                  </Link>
                  <a
                    href={env.DISCORD_URL}
                    className="hover:text-foreground"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Discord
                  </a>
                  <a
                    href={GITHUB_ORGANIZATION_URL}
                    className="hover:text-foreground"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </HoverCardContent>
            </HoverCard>
            <Link
              href={href(routes.about.terms)}
              className="hover:text-foreground"
            >
              {content.footerTerms}
            </Link>
            <Link
              href={href(routes.about.privacy)}
              className="hover:text-foreground"
            >
              {content.footerPrivacy}
            </Link>
            <Link
              href={href(routes.about.imprint)}
              className="hover:text-foreground"
            >
              {content.footerImprint}
            </Link>
            <CookieSettingsTrigger className="hover:text-foreground text-left" />
            <LanguageDropdown />
          </nav>
        </div>
      </footer>
    </div>
  );
}
