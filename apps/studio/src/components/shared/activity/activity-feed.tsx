"use client";

import type { ReactNode } from "react";

import { InboxIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { useActivities, useMarkActivitySeen } from "@/lib/query/services";
import { ScrollArea } from "@wowlab/shared/components/ui/scroll-area";
import { Separator } from "@wowlab/shared/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@wowlab/shared/components/ui/sheet";

import { ActivityRenderer } from "./activity-renderer";

type ActivityFeedProps = {
  trigger: ReactNode;
};

export function ActivityFeed({ trigger }: Readonly<ActivityFeedProps>) {
  const { data } = useActivities();
  const markSeen = useMarkActivitySeen();
  const content = useIntlayer("activityFeed");

  const items = data?.items ?? [];
  const seenAt = data?.seen_at ?? "1970-01-01T00:00:00Z";

  return (
    <Sheet onOpenChange={(open) => open && markSeen.mutate()}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="gap-0 sm:max-w-112 [&>button]:top-2.75 [&>button>svg]:size-5">
        <SheetHeader className="border-b py-2.25">
          <SheetTitle className="text-lg leading-6">{content.title}</SheetTitle>
          <SheetDescription hidden />
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16">
              <InboxIcon className="text-muted-foreground size-8" />
              <p className="text-muted-foreground text-sm">
                {content.emptyMessage}
              </p>
            </div>
          ) : (
            items.map((item, i) => (
              <div key={item.id}>
                {i > 0 && <Separator />}
                <ActivityRenderer item={item} seenAt={seenAt} />
              </div>
            ))
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
