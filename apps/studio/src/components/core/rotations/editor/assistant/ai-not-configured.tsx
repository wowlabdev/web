"use client";

import { SparklesIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { buttonVariants } from "@wowlab/shared/components/ui/button";
import { Link } from "@wowlab/shared/components/ui/link";
import { href, routes } from "@wowlab/shared/lib/routing";
import { cn } from "@wowlab/shared/lib/utils";

export function AiNotConfigured() {
  const content = useIntlayer("rotationAssistant");

  return (
    <Alert>
      <SparklesIcon />
      <AlertTitle>{content.notConfiguredTitle}</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <span>{content.notConfiguredDescription}</span>
        <Link
          href={href(routes.account.settings)}
          className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
        >
          {content.notConfiguredLink}
        </Link>
      </AlertDescription>
    </Alert>
  );
}
