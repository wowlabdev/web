"use client";

import { ActivityIcon } from "lucide-react";

import { ActivityFeed, useUnreadCount } from "@/components/shared/activity";
import { Button } from "@wowlab/shared/components/ui/button";

export function ActivityFeedButton() {
  const unreadCount = useUnreadCount();

  return (
    <ActivityFeed
      trigger={
        <Button variant="ghost" size="icon" className="relative">
          <ActivityIcon />
          {unreadCount > 0 && (
            <span className="bg-destructive absolute top-2 right-2.5 size-2 rounded-full" />
          )}
        </Button>
      }
    />
  );
}
