import type { ReactNode } from "react";

import { Avatar, AvatarFallback } from "@wowlab/shared/components/ui/avatar";
import { Card, CardContent } from "@wowlab/shared/components/ui/card";
import { Link } from "@wowlab/shared/components/ui/link";
import { cn } from "@wowlab/shared/lib/utils";

type Feature = {
  avatarBgColor?: string;
  avatarTextColor?: string;
  cardBorderColor?: string;
  description: ReactNode;
  href?: string;
  icon: ReactNode;
  key: string;
  title: ReactNode;
};

type FeatureGridProps = {
  action?: ReactNode;
  className?: string;
  columns?: 2 | 3;
  description?: ReactNode;
  eyebrow?: ReactNode;
  featuresList: Feature[];
  title?: ReactNode;
};

export function FeatureGrid({
  action,
  className,
  columns = 3,
  description,
  eyebrow,
  featuresList,
  title,
}: Readonly<FeatureGridProps>) {
  const columnsClass = columns === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";
  const hasHeader = title || description || eyebrow || action;

  return (
    <section className={cn("py-4", className)}>
      <div className="mx-auto w-full">
        {hasHeader ? (
          <div className="mb-8 space-y-3">
            {eyebrow ? (
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>
            ) : null}
            {description ? (
              <p className="text-muted-foreground max-w-2xl text-sm">
                {description}
              </p>
            ) : null}
            {action ? <div className="pt-1">{action}</div> : null}
          </div>
        ) : null}

        <div className={cn("grid gap-4 sm:grid-cols-2", columnsClass)}>
          {featuresList.map((feature) => {
            const card = (
              <Card
                className={cn(
                  "h-full shadow-none transition-colors duration-200",
                  feature.cardBorderColor,
                  feature.href && "hover:border-primary/40",
                )}
              >
                <CardContent>
                  <Avatar className="mb-4 size-9 rounded-md">
                    <AvatarFallback
                      className={cn(
                        "rounded-md [&>svg]:size-5",
                        feature.avatarBgColor ?? "bg-primary/10",
                        feature.avatarTextColor ?? "text-primary",
                      )}
                    >
                      {feature.icon}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mb-1 text-sm font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );

            if (!feature.href) {
              return <div key={feature.key}>{card}</div>;
            }

            return (
              <Link
                key={feature.key}
                href={feature.href}
                className="focus-visible:ring-ring block rounded-md focus-visible:ring-2 focus-visible:outline-none"
              >
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
