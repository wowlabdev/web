"use client";

import type { ReactNode } from "react";

import { LinkIcon, SettingsIcon, XIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { Fragment } from "react";

import {
  NOTIFICATION_GENERAL_ITEMS,
  NOTIFICATION_INBOX_ITEMS,
} from "@/components/shared/layout/__fixtures__/notification-dropdown-fixtures";
import { Avatar, AvatarFallback } from "@wowlab/shared/components/ui/avatar";
import { Badge } from "@wowlab/shared/components/ui/badge";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@wowlab/shared/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wowlab/shared/components/ui/tabs";
import { cn } from "@wowlab/shared/lib/utils";

export type MockNotification = {
  id: string;
  initials: string;
  kind: "comment" | "file" | "post" | "request";
  name: string;
  time: {
    count: number;
    unit: "hours" | "minutes";
  };
};
type NotificationDropdownProps = {
  align?: "start" | "center" | "end";
  isDefaultOpen?: boolean;
  trigger: ReactNode;
};

export function NotificationDropdown({
  align = "end",
  isDefaultOpen,
  trigger,
}: Readonly<NotificationDropdownProps>) {
  const content = useIntlayer("dashboardLayout");
  const timeAgo = ({ count, unit }: MockNotification["time"]) =>
    unit === "minutes"
      ? content.notificationsTimeMinutesAgo(count)
      : content.notificationsTimeHoursAgo(count);
  const kindLabel = (kind: MockNotification["kind"]) => {
    switch (kind) {
      case "comment": {
        return content.notificationsNewComment;
      }

      case "file": {
        return content.notificationsAttachedFiles;
      }

      case "post": {
        return content.notificationsNewPost;
      }

      case "request": {
        return content.notificationsNewRequest;
      }
    }
  };

  const title = (notification: MockNotification) => {
    switch (notification.kind) {
      case "file": {
        return content.notificationsAttachedFile({ name: notification.name });
      }

      case "request": {
        return content.notificationsAppliedToCampaign({
          name: notification.name,
        });
      }

      default: {
        return notification.name;
      }
    }
  };
  const renderItems = (items: MockNotification[]) =>
    items.map((notification, index) => {
      const isPersonRow =
        notification.kind === "post" || notification.kind === "comment";

      return (
        <Fragment key={notification.id}>
          {index > 0 && <DropdownMenuSeparator />}
          <DropdownMenuItem
            className={cn(
              "gap-3 px-2 py-3 text-base",
              !isPersonRow && "items-start",
            )}
          >
            <Avatar className="size-9.5">
              <AvatarFallback>{notification.initials}</AvatarFallback>
            </Avatar>
            <div className="flex w-full flex-col items-start">
              <span className="text-base font-medium">
                {title(notification)}
              </span>
              <div className="flex items-center gap-2.5">
                <span className="text-muted-foreground text-sm">
                  {timeAgo(notification.time)}
                </span>
                <div className="bg-muted size-1.5 rounded-full" />
                <span className="text-muted-foreground text-sm">
                  {kindLabel(notification.kind)}
                </span>
              </div>
              {notification.kind === "request" && (
                <div className="mt-3 flex items-center gap-4">
                  <Button variant="secondary" size="sm">
                    {content.notificationsDecline}
                  </Button>
                  <Button size="sm">{content.notificationsAccept}</Button>
                </div>
              )}
              {notification.kind === "file" && (
                <div className="mt-3 flex items-center gap-1.5">
                  <LinkIcon className="text-foreground" />
                  <span className="text-sm">
                    {content.notificationsLinkExample}
                  </span>
                </div>
              )}
            </div>
            {isPersonRow && (
              <div className="flex flex-col items-center gap-3">
                <XIcon className="text-foreground size-3.5" />
                <div className="bg-primary size-1.5 rounded-full" />
              </div>
            )}
          </DropdownMenuItem>
        </Fragment>
      );
    });

  return (
    <DropdownMenu defaultOpen={isDefaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-xs sm:max-w-122" align={align}>
        <Tabs defaultValue="inbox" className="gap-0">
          <DropdownMenuLabel className="flex flex-col pb-0">
            <div className="flex items-center justify-between gap-6 pb-2.5">
              <span className="text-muted-foreground text-base font-normal uppercase">
                {content.notificationsTitle}
              </span>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary font-normal"
              >
                {content.notificationsNewBadge(8)}
              </Badge>
            </div>
            <div className="-mb-0.5 flex items-center justify-between gap-4">
              <TabsList className="relative h-fit rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="inbox"
                  className="data-[state=active]:!border-b-primary rounded-none border-b-2 border-b-transparent font-normal data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
                >
                  {content.notificationsInbox}
                </TabsTrigger>
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:!border-b-primary rounded-none border-b-2 border-b-transparent font-normal data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
                >
                  {content.notificationsGeneral}
                </TabsTrigger>
              </TabsList>
              <SettingsIcon className="size-5" />
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="mt-0 h-0.5" />

          <TabsContent value="inbox">
            {renderItems(NOTIFICATION_INBOX_ITEMS)}
          </TabsContent>

          <TabsContent value="general">
            {renderItems(NOTIFICATION_GENERAL_ITEMS)}
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
