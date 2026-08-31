import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  GameDataIsland,
  NodeIsland,
  SearchIsland,
  TourIsland,
  UserDataIsland,
} from "@/components/shared/islands";
import { AppShell } from "@/components/shared/layout/app-shell";
import { GameDataOverlay } from "@/components/shared/layout/game-data-overlay";
import { getSearchEntries } from "@/lib/search/entries";
import { CookieConsentMount } from "@wowlab/shared/components/cookie-consent";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
};

export default function StudioShellLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const searchEntries = getSearchEntries();

  return (
    <SearchIsland entries={searchEntries}>
      <GameDataIsland>
        <UserDataIsland>
          <NodeIsland>
            <TourIsland>
              <AppShell>{children}</AppShell>
            </TourIsland>
          </NodeIsland>
        </UserDataIsland>
        <GameDataOverlay />
      </GameDataIsland>
      <CookieConsentMount />
    </SearchIsland>
  );
}
