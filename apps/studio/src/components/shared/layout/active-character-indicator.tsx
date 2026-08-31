"use client";

import type { ReactNode } from "react";

import { UserPlusIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { GameSpec } from "@/components/shared/game/game-spec";
import { useMounted } from "@/hooks";
import { useEffectiveActiveId } from "@/lib/state/character-store";
import { useSavedCharacter } from "@/lib/user-data";
import { Link } from "@wowlab/shared/components/ui/link";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@wowlab/shared/components/ui/sidebar";
import { href, routes } from "@wowlab/shared/lib/routing";

export function ActiveCharacterIndicator() {
  const content = useIntlayer("dashboardLayout");
  const mounted = useMounted();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={href(routes.simulate.character)}>
          {mounted ? (
            <ActiveCharacterLabel noneLabel={content.characterNone} />
          ) : (
            <CharacterNone label={content.characterNone} />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function ActiveCharacterLabel({
  noneLabel,
}: {
  readonly noneLabel: ReactNode;
}) {
  const activeId = useEffectiveActiveId();
  const { data: character } = useSavedCharacter(activeId);

  if (!character) {
    return <CharacterNone label={noneLabel} />;
  }

  return <GameSpec specId={character.specId} size="sm" />;
}

function CharacterNone({ label }: { readonly label: ReactNode }) {
  return (
    <span className="text-muted-foreground flex items-center gap-1.5">
      <UserPlusIcon className="size-4" />
      {label}
    </span>
  );
}
