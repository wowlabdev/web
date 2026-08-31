"use client";

import { useIntlayer } from "next-intlayer";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";
import { LogoSpinner } from "@wowlab/shared/components/ui/logo-spinner";

export function ValidationRunning() {
  const content = useIntlayer("rotationEditor");

  return (
    <Alert>
      <LogoSpinner className="size-3.5" />
      <AlertTitle>{content.validationRunningTitle}</AlertTitle>
      <AlertDescription>
        {content.validationRunningDescription}
      </AlertDescription>
    </Alert>
  );
}
