import type { ReactNode } from "react";

import Link from "next/link";

import { Button } from "@wowlab/shared/components/ui/button";

import { ErrorPage } from "./error-page";

type ErrorPageNotFoundProps = {
  actionLabel: ReactNode;
  description: ReactNode;
  subtitle: ReactNode;
};

export function ErrorPageNotFound({
  actionLabel,
  description,
  subtitle,
}: Readonly<ErrorPageNotFoundProps>) {
  return (
    <ErrorPage
      title="404"
      subtitle={subtitle}
      description={description}
      action={
        <Button size="lg" className="rounded-lg text-base" asChild>
          <Link href="/">{actionLabel}</Link>
        </Button>
      }
    />
  );
}
