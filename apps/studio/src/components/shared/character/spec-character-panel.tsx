"use client";

import { useIntlayer } from "next-intlayer";

import { CharacterPanel } from "./character-panel";
import { useSpecPaperdollProfile } from "./use-spec-paperdoll-profile";

type SpecCharacterPanelProps = {
  specId: number | null;
  variant?: "full" | "summary";
};

export function SpecCharacterPanel({
  specId,
  variant,
}: Readonly<SpecCharacterPanelProps>) {
  const content = useIntlayer("characterPanel");
  const { profile } = useSpecPaperdollProfile(specId);

  if (!profile) {
    return (
      <p className="text-sm text-muted-foreground">{content.emptyForSpec}</p>
    );
  }

  return <CharacterPanel profile={profile} specId={specId} variant={variant} />;
}
