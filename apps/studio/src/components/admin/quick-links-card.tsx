"use client";

import { AtSignIcon, CalendarIcon, Link2Icon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardHeader, CardTitle } from "@wowlab/shared/components/ui/card";
import { Link } from "@wowlab/shared/components/ui/link";
import { href, routes } from "@wowlab/shared/lib/routing";

export function QuickLinksCard() {
  const content = useIntlayer("admin");

  const links = [
    {
      href: href(routes.admin.handles),
      icon: <AtSignIcon className="size-4" />,
      label: content.nav.handles,
    },
    {
      href: href(routes.admin.seasons),
      icon: <CalendarIcon className="size-4" />,
      label: content.nav.seasons,
    },
    {
      href: href(routes.admin.tools),
      icon: <Link2Icon className="size-4" />,
      label: content.nav.tools,
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>{content.overview.quickLinks}</CardTitle>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Button key={link.href} asChild variant="outline" size="sm">
              <Link href={link.href}>
                {link.icon}
                {link.label}
              </Link>
            </Button>
          ))}
        </div>
      </CardHeader>
    </Card>
  );
}
