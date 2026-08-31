"use client";

import { useIntlayer } from "next-intlayer";
import { type ReactNode } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@wowlab/shared/components/ui/card";

import { CharacterImportDialog } from "./character-import";

type CharacterSwitcherProps = {
  action?: ReactNode;
  children: ReactNode;
};

export function CharacterSwitcher({
  action,
  children,
}: Readonly<CharacterSwitcherProps>) {
  const content = useIntlayer("characterPage");

  return (
    <Card className="gap-0 py-0" size="sm">
      <CardHeader className="items-center border-b py-3">
        <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {content.listTitle}
        </h2>
        <CardAction className="flex items-center gap-1.5">
          {action}
          <CharacterImportDialog />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 p-3">{children}</CardContent>
    </Card>
  );
}
