"use client";

import { type ReactNode } from "react";

import { RelativeTime } from "@wowlab/shared/components/common";
import { cn } from "@wowlab/shared/lib/utils";

type ActivityItemProps = {
  at: string;
  children?: ReactNode;
  icon: ReactNode;
  seenAt: string;
  title: ReactNode;
};

export function ActivityItem({
  at,
  children,
  icon,
  seenAt,
  title,
}: Readonly<ActivityItemProps>) {
  const isUnread = new Date(at) > new Date(seenAt);

  return (
    <div className={cn("flex gap-4 px-4 py-3", isUnread && "bg-primary/5")}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full">
        {icon}
      </div>
      <div className="flex w-full flex-col items-start gap-1">
        <div className="text-muted-foreground flex flex-col items-start text-sm">
          <p>{title}</p>
          <p className="text-xs">
            <RelativeTime at={at} />
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
