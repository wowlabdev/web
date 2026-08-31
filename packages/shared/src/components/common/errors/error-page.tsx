import type { ReactNode } from "react";

import { LogoBackdrop } from "../logo-backdrop";

type ErrorPageProps = {
  action?: ReactNode;
  description?: ReactNode;
  subtitle?: ReactNode;
  title: ReactNode;
};

export function ErrorPage({
  action,
  description,
  subtitle,
  title,
}: Readonly<ErrorPageProps>) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-12 overflow-hidden px-8 py-8 sm:py-16 lg:py-24">
      <LogoBackdrop />

      <div className="relative z-10 text-center">
        <h3 className="mb-6 text-7xl font-bold tracking-tight sm:text-8xl">
          {title}
        </h3>
        {subtitle ? (
          <h4 className="mb-1.5 text-3xl font-semibold">{subtitle}</h4>
        ) : null}
        {description ? (
          <div className="text-muted-foreground mb-6">{description}</div>
        ) : null}
        {action}
      </div>
    </div>
  );
}
