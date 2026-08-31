"use client";

import { useLocale } from "next-intlayer";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import { Link } from "@wowlab/shared/components/ui/link";
import { href, routes } from "@wowlab/shared/lib/routing";

export function AdminNav() {
  const { pathWithoutLocale } = useLocale();
  const content = useIntlayer("admin");

  const items = [
    { label: content.nav.overview, route: routes.admin.overview },
    { label: content.nav.billing, route: routes.admin.billing.index },
    { label: content.nav.seasons, route: routes.admin.seasons },
    { label: content.nav.handles, route: routes.admin.handles },
    { label: content.nav.paperdolls, route: routes.admin.paperdolls },
    { label: content.nav.shortUrls, route: routes.admin.shortUrls },
    { label: content.nav.bunny, route: routes.admin.bunny },
    { label: content.nav.fleet, route: routes.admin.fleet },
    { label: content.nav.actions, route: routes.admin.actions },
    { label: content.nav.tools, route: routes.admin.tools },
    { label: content.nav.settings, route: routes.admin.settings },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2 border-b pb-3">
      {items.map(({ label, route }) => {
        const path = href(route);
        const isActive = pathWithoutLocale.startsWith(path);

        return (
          <Button key={path} asChild variant={isActive ? "secondary" : "ghost"}>
            <Link href={path}>{label}</Link>
          </Button>
        );
      })}
    </div>
  );
}
