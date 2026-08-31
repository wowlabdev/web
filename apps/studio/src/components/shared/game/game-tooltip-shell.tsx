"use client";

import type { ReactNode } from "react";

import { Search } from "lucide-react";
import { useIntlayer, useLocale } from "next-intlayer";

import { Separator } from "@wowlab/shared/components/ui/separator";
import { makeIconUrl } from "@wowlab/shared/lib/links";
import { getLocalizedUrl } from "@wowlab/shared/lib/routing";
import { cn } from "@wowlab/shared/lib/utils";

import { GameIcon } from "./game-icon";

export type GameTooltipShellProps = {
  children?: ReactNode;
  header: ReactNode;
  href?: string;
  iconName?: string;
};

export function GameTooltipShell({
  children,
  header,
  href,
  iconName,
}: Readonly<GameTooltipShellProps>) {
  const { locale } = useLocale();
  const content = useIntlayer("commonComponents");

  return (
    <div
      data-slot="game-tooltip"
      className="w-72 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 shadow-xl"
    >
      <div className="relative flex items-center gap-3 px-3 pt-3 pb-2.5">
        {href && (
          <a
            href={getLocalizedUrl(href, locale)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={content.inspect.value}
            onClick={(event) => event.stopPropagation()}
            className="absolute top-2 right-2 z-10 flex size-5 items-center justify-center rounded-sm text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <Search className="size-3.5" />
          </a>
        )}
        {iconName && (
          <>
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15 blur-sm"
              style={{
                backgroundImage: `url(${makeIconUrl(iconName, "large")})`,
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-neutral-950" />
          </>
        )}
        {iconName && (
          <div className="relative shrink-0 overflow-hidden rounded-md border border-neutral-700/50 shadow-md">
            <GameIcon iconName={iconName} size="lg" />
          </div>
        )}
        <div
          className={cn("relative flex min-w-0 flex-col gap-1", href && "pr-5")}
        >
          {header}
        </div>
      </div>

      {children ? (
        <div className="flex flex-col gap-1 px-3 pb-3">
          <Separator className="mb-2.5 bg-neutral-800" />
          {children}
        </div>
      ) : null}
    </div>
  );
}
