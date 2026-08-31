"use client";

import {
  BarChart3Icon,
  BellIcon,
  CameraIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@wowlab/shared/components/ui/card";

const ACTIONS = [
  { icon: BarChart3Icon, key: "rebuildRankings" },
  { icon: RefreshCwIcon, key: "refreshRollups" },
  { icon: CameraIcon, key: "snapshotRankings" },
  { icon: BellIcon, key: "syncDiscord" },
] as const;

export function ActionsPage() {
  const content = useIntlayer("admin");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        const card = content.actions.cards[action.key];

        return (
          <Card key={action.key}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="size-4" />
                {card.title}
                <Badge variant="outline">{content.actions.comingSoon}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {card.description}
              </p>
              <Button disabled variant="outline" size="sm">
                {content.actions.runAction}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
