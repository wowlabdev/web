"use client";

import { InfoIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { Link } from "@wowlab/shared/components/ui/link";
import { href, routes } from "@wowlab/shared/lib/routing";

export function RotationUnsupportedAlert() {
  const content = useIntlayer("rotations");

  return (
    <Alert>
      <InfoIcon className="size-4" />
      <AlertTitle>{content.unsupportedTitle}</AlertTitle>
      <AlertDescription>
        {content.unsupportedDescriptionPrefix}{" "}
        <Link href={href(routes.dev.engine)} className="underline">
          {content.unsupportedLink}
        </Link>{" "}
        {content.unsupportedDescriptionSuffix}
      </AlertDescription>
    </Alert>
  );
}
