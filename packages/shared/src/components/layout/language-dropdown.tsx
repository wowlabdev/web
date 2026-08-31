"use client";

import type { ReactNode } from "react";

import { getLocaleName } from "intlayer";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useLocale } from "next-intlayer";

import { Button } from "@wowlab/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@wowlab/shared/components/ui/dropdown-menu";
import { cn } from "@wowlab/shared/lib/utils";

type LanguageDropdownProps = {
  align?: "start" | "center" | "end";
  isDefaultOpen?: boolean;
  trigger?: ReactNode;
};

export function LanguageDropdown({
  align = "end",
  isDefaultOpen,
  trigger,
}: Readonly<LanguageDropdownProps>) {
  const { availableLocales, locale, setLocale } = useLocale();

  return (
    <DropdownMenu defaultOpen={isDefaultOpen}>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-auto gap-1.5 px-2 text-xs font-normal"
          >
            {getLocaleName(locale)}
            <ChevronDownIcon className="size-3 opacity-60" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-44 p-1">
        {availableLocales.map((loc) => {
          const isActive = loc === locale;

          return (
            <DropdownMenuItem
              key={loc}
              onSelect={() => setLocale(loc)}
              className={cn(
                "gap-3 px-2.5 py-2 text-sm",
                isActive && "bg-accent/60 focus:bg-accent/60",
              )}
            >
              <span className="text-muted-foreground w-7 font-mono text-[10px] tracking-wider uppercase">
                {loc}
              </span>
              <span className="flex-1 font-medium">{getLocaleName(loc)}</span>
              {isActive ? (
                <CheckIcon className="text-primary size-4" />
              ) : (
                <span className="size-4" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
