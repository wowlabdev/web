import type { ReactNode } from "react";

import { GameIcon } from "@/components/shared/game/game-icon";

type InspectEntityHeaderProps = {
  actions?: ReactNode;
  badges?: ReactNode;
  iconName?: null | string;
  id: number;
  name: string;
  subtitle?: ReactNode;
};

export function InspectEntityHeader({
  actions,
  badges,
  iconName,
  id,
  name,
  subtitle,
}: Readonly<InspectEntityHeaderProps>) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        {iconName && <GameIcon iconName={iconName} size="lg" alt={name} />}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{name}</h1>
            <span className="text-muted-foreground text-sm">#{id}</span>
          </div>
          {subtitle ? (
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          ) : null}
          {badges ? (
            <div className="flex flex-wrap gap-1.5 pt-1">{badges}</div>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
