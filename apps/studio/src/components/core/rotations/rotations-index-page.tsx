"use client";

import { ArrowRightIcon, PenLineIcon, SearchIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";
import { Link } from "@wowlab/shared/components/ui/link";
import { href, routes } from "@wowlab/shared/lib/routing";

export function RotationsIndexPage() {
  const content = useIntlayer("rotations");

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <SearchIcon className="size-4" />
            {routes.rotations.browse.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {routes.rotations.browse.description}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={href(routes.rotations.browse)}>
              {content.browseButton}
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PenLineIcon className="size-4" />
            {routes.rotations.editor.index.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {routes.rotations.editor.index.description}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={href(routes.rotations.editor.index)}>
              {content.createButton}
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
