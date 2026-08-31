"use client";

import type { ValidationError } from "wowlab-engine";

import { CircleSlashIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";

import { useEditorDocument } from "../editor-store-provider";
import { ValidationErrorItem } from "./validation-error-item";

type ValidationIssuesProps = {
  errors: ValidationError[];
};

export function ValidationIssues({ errors }: Readonly<ValidationIssuesProps>) {
  const content = useIntlayer("rotationEditor");
  const lists = useEditorDocument((s) => s.script.lists);

  return (
    <Alert variant="destructive">
      <CircleSlashIcon className="size-3.5" />
      <AlertTitle>
        {content.validationErrorsTitle({ count: errors.length }).value}
      </AlertTitle>
      <AlertDescription>
        <ul className="mt-1 space-y-0.5">
          {errors.map((err) => (
            <ValidationErrorItem
              key={JSON.stringify(err)}
              error={err}
              lists={lists}
            />
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
