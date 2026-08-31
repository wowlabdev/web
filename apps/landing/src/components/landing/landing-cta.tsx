import type { ReactNode } from "react";

import { ArrowRightIcon } from "lucide-react";

import { Button } from "@wowlab/shared/components/ui/button";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { Link } from "@wowlab/shared/components/ui/link";
import { MotionPreset } from "@wowlab/shared/components/ui/motion-preset";
import { cn } from "@wowlab/shared/lib/utils";

export function LandingCta({
  buttonHref,
  buttonLabel,
  className,
  description,
  secondaryHref,
  secondaryLabel,
  title,
  tone = "primary",
}: Readonly<{
  buttonHref: string;
  buttonLabel: ReactNode;
  className?: string;
  description?: ReactNode;
  secondaryHref?: string;
  secondaryLabel?: ReactNode;
  title: ReactNode;
  tone?: "primary" | "muted";
}>) {
  const isPrimary = tone === "primary";

  return (
    <section className={cn("py-4", className)}>
      <MotionPreset fade slide className="mx-auto w-full">
        <Card
          className={cn(
            "border-0 shadow-none",
            isPrimary ? "bg-primary" : "bg-muted",
          )}
        >
          <CardContent className="flex flex-col gap-4 py-8 md:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h2
                className={cn(
                  "text-xl font-semibold md:text-2xl",
                  isPrimary && "text-primary-foreground",
                )}
              >
                {title}
              </h2>
              {description ? (
                <p
                  className={cn(
                    "text-sm md:text-base",
                    isPrimary
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  {description}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {secondaryLabel && secondaryHref ? (
                <Button asChild variant="ghost">
                  <Link
                    href={secondaryHref}
                    className={cn(
                      "inline-flex items-center gap-2",
                      isPrimary &&
                        "text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
                    )}
                  >
                    {secondaryLabel}
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="secondary">
                <Link
                  href={buttonHref}
                  className="inline-flex items-center gap-2"
                >
                  {buttonLabel}
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </MotionPreset>
    </section>
  );
}
