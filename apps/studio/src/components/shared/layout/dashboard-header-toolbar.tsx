"use client";

import { BellIcon, LanguagesIcon, SearchIcon, Share2Icon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import { useSearch } from "@/components/shared/islands";
import { ActivityFeedButton } from "@/components/shared/layout/activity-feed-button";
import { NotificationDropdown } from "@/components/shared/layout/notification-dropdown";
import { ProfileDropdown } from "@/components/shared/layout/profile-dropdown";
import { ShareDropdown } from "@/components/shared/layout/share-dropdown";
import { ThemeToggle } from "@/components/shared/layout/theme-toggle";
import { SearchDialog } from "@/components/shared/search";
import { MORE_PEOPLE, SHARE_DATA } from "@/lib/layout/demo-data";
import { useAuthUser } from "@/lib/query/services";
import { LanguageDropdown } from "@wowlab/shared/components/layout/language-dropdown";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@wowlab/shared/components/ui/avatar";
import { Button } from "@wowlab/shared/components/ui/button";
import { Link } from "@wowlab/shared/components/ui/link";
import { Separator } from "@wowlab/shared/components/ui/separator";
import { SidebarTrigger } from "@wowlab/shared/components/ui/sidebar";
import { href, routes } from "@wowlab/shared/lib/routing";

export function DashboardHeaderToolbar() {
  const authUser = useAuthUser();
  const { openSearch } = useSearch();
  const content = useIntlayer("dashboardLayout");

  return (
    <header className="bg-background sticky top-0 z-50 flex items-center justify-between gap-6 fl-px-4/6 py-2">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="[&_svg]:!size-5" />
        <Separator orientation="vertical" className="hidden !h-4 sm:block" />
        <Button
          id="tour-search"
          variant="ghost"
          className="hidden !bg-transparent px-1 py-0 font-normal sm:block"
          onClick={openSearch}
        >
          <div className="text-muted-foreground hidden items-center gap-1.5 text-sm sm:flex">
            <SearchIcon />
            <span>{content.toolbarSearchPlaceholder}</span>
          </div>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={openSearch}
        >
          <SearchIcon />
          <span className="sr-only">{content.toolbarSearch}</span>
        </Button>
        <SearchDialog />
      </div>
      <div className="flex items-center gap-1.5">
        <ShareDropdown
          data={SHARE_DATA}
          morePeople={MORE_PEOPLE}
          trigger={
            <Button variant="ghost" size="icon">
              <Share2Icon />
            </Button>
          }
        />
        <LanguageDropdown
          trigger={
            <Button variant="ghost" size="icon">
              <LanguagesIcon />
            </Button>
          }
        />
        <ActivityFeedButton />
        <ThemeToggle />
        <NotificationDropdown
          trigger={
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon />
              <span className="bg-destructive absolute top-2 right-2.5 size-2 rounded-full" />
            </Button>
          }
        />
        {authUser.isAuthenticated ? (
          <ProfileDropdown
            user={authUser}
            trigger={
              <Button
                id="tour-account"
                variant="ghost"
                size="icon"
                className="size-9.5"
              >
                <Avatar className="size-9.5 rounded-md">
                  {authUser.avatar && <AvatarImage src={authUser.avatar} />}
                  <AvatarFallback>{authUser.initials}</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
        ) : (
          <Button size="sm" asChild>
            <Link href={href(routes.auth.signIn)}>{content.signIn}</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
