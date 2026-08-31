"use client";

import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";
type ActionStatusBadgesProps = {
  fires: number;
  isDisabled: boolean;
};

export function ActionStatusBadges({
  fires,
  isDisabled,
}: Readonly<ActionStatusBadgesProps>) {
  const content = useIntlayer("rotationEditor");

  return (
    <>
      {isDisabled && (
        <Badge variant="secondary" className="shrink-0 text-xs">
          {content.actionDisabledBadge}
        </Badge>
      )}
      {fires > 0 && (
        <Badge variant="outline" className="shrink-0 text-xs">
          {content.actionFiresCount(fires)}
        </Badge>
      )}
    </>
  );
}
