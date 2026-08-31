import type { ReactNode } from "react";

import type { RailColor } from "@wowlab/shared/lib/routing/types";

import { cn } from "@wowlab/shared/lib/utils";

const RAIL_BORDER: Record<RailColor, string> = {
  amber: "border-l-rail-amber",
  emerald: "border-l-rail-emerald",
  orange: "border-l-rail-orange",
  purple: "border-l-rail-purple",
  slate: "border-l-rail-slate",
  zinc: "border-l-rail-zinc",
};

type HeaderPanelProps = {
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  railColor: RailColor;
  title: ReactNode;
  titleAs?: "h1" | "h2";
};

export function HeaderPanel({
  actions,
  breadcrumbs,
  children,
  description,
  railColor,
  title,
  titleAs: TitleTag = "h1",
}: Readonly<HeaderPanelProps>) {
  return (
    <header>
      <div
        className={cn(
          "flex flex-col gap-1.5 border-l-[3px] pb-4 fl-px-0/1",
          RAIL_BORDER[railColor],
        )}
      >
        {breadcrumbs}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-0.5">
            <TitleTag className="text-sm font-bold">{title}</TitleTag>
            {description ? (
              <p className="text-muted-foreground max-w-3xl text-xs">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-row gap-2">{actions}</div>
          ) : null}
        </div>
        {children}
      </div>
    </header>
  );
}
