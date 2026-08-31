import type { ReactNode } from "react";

import { cn } from "@wowlab/shared/lib/utils";

type SectionHeaderProps = {
  description?: ReactNode;
  eyebrow?: ReactNode;
  title?: ReactNode;
  align?: "center" | "left";
  className?: string;
  titleAs?: "h1" | "h2";
};

export function SectionHeader({
  align = "center",
  className,
  description,
  eyebrow,
  title,
  titleAs = "h2",
}: Readonly<SectionHeaderProps>) {
  if (!eyebrow && !title && !description) {
    return null;
  }

  const Title = titleAs;

  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-primary text-sm font-medium uppercase tracking-wide">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <Title className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
          {title}
        </Title>
      ) : null}
      {description ? (
        <p
          className={cn(
            "text-muted-foreground text-lg md:text-xl",
            align === "center" && "mx-auto max-w-2xl",
            align === "left" && "max-w-2xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
