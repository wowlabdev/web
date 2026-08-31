"use client";

import type { ValidationWarning } from "wowlab-engine";

import { AlertTriangleIcon, CheckCircle2Icon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@wowlab/shared/components/ui/alert";

type ValidationOkProps = {
  warnings: ValidationWarning[];
};

export function ValidationOk({ warnings }: Readonly<ValidationOkProps>) {
  const content = useIntlayer("rotationEditor");

  if (warnings.length === 0) {
    return (
      <Alert>
        <CheckCircle2Icon className="size-3.5" />
        <AlertTitle>{content.validationOkTitle}</AlertTitle>
        <AlertDescription>{content.validationOkDescription}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <AlertTriangleIcon className="size-3.5" />
      <AlertTitle>
        {content.validationWarningsTitle({ count: warnings.length }).value}
      </AlertTitle>
      <AlertDescription>
        <ul className="mt-1 space-y-0.5">
          {warnings.map((warning) => (
            <li key={JSON.stringify(warning)}>
              {renderWarning(content, warning)}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

function renderWarning(
  content: ReturnType<typeof useIntlayer>,
  warning: ValidationWarning,
): string {
  switch (warning.type) {
    case "constantCondition": {
      return content.validationWarningConstant({
        location: warning.location,
        value: String(warning.value),
      }).value;
    }

    case "unusedList": {
      return content.validationWarningUnusedList({ name: warning.name }).value;
    }

    case "unusedVariable": {
      return content.validationWarningUnusedVariable({ name: warning.name })
        .value;
    }
  }
}
