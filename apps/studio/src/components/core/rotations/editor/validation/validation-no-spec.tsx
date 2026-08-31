"use client";

import { InfoIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";

export function ValidationNoSpec() {
  const content = useIntlayer("rotationEditor");

  return (
    <Alert>
      <InfoIcon className="size-3.5" />
      <AlertTitle>{content.validationNoSpecTitle}</AlertTitle>
      <AlertDescription>{content.validationNoSpecDescription}</AlertDescription>
    </Alert>
  );
}
