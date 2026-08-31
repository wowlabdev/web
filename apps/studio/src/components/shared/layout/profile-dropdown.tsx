"use client";

import type { ReactNode } from "react";

import {
  CompassIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useRouter } from "next/navigation";
import { useNextStep } from "nextstepjs";

import type { AuthUser } from "@/lib/query/services";

import { WELCOME_TOUR } from "@/components/shared/tour";
import { useUserAccount } from "@/lib/query/services";
import { StatusDot } from "@wowlab/shared/components/common";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@wowlab/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@wowlab/shared/components/ui/dropdown-menu";
import { makeBillingUrl } from "@wowlab/shared/lib/links";
import { href } from "@wowlab/shared/lib/routing";
import { routes } from "@wowlab/shared/lib/routing/routes";

type ProfileDropdownProps = {
  align?: "start" | "center" | "end";
  isDefaultOpen?: boolean;
  trigger: ReactNode;
  user: AuthUser;
};

export function ProfileDropdown({
  align = "end",
  isDefaultOpen,
  trigger,
  user,
}: Readonly<ProfileDropdownProps>) {
  const router = useRouter();
  const { logout } = useUserAccount();
  const { startNextStep } = useNextStep();
  const content = useIntlayer("dashboardLayout");
  const tour = useIntlayer("onboardingTour");

  async function handleSignOut() {
    await logout();
    router.push(href(routes.home));
    router.refresh();
  }

  return (
    <DropdownMenu defaultOpen={isDefaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align={align}>
        <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
          <div className="relative">
            <Avatar className="size-10">
              {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <StatusDot
              tone="success"
              className="ring-card absolute right-0 bottom-0 size-2 ring-2"
            />
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-foreground text-lg font-semibold">
              {user.name}
            </span>
            {user.email && (
              <span className="text-muted-foreground text-base">
                {user.email}
              </span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="px-4 py-2.5 text-base"
            onClick={() => router.push(href(routes.account.index))}
          >
            <LayoutDashboardIcon className="text-foreground size-5" />
            <span>{content.profileOverview}</span>
          </DropdownMenuItem>
          {user.handle && (
            <DropdownMenuItem
              className="px-4 py-2.5 text-base"
              onClick={() =>
                router.push(href(routes.users.profile, { handle: user.handle }))
              }
            >
              <UserIcon className="text-foreground size-5" />
              <span>{content.profileProfile}</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="px-4 py-2.5 text-base"
            onClick={() => router.push(makeBillingUrl())}
          >
            <CreditCardIcon className="text-foreground size-5" />
            <span>{content.profileBilling}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="px-4 py-2.5 text-base"
            onClick={() => router.push(href(routes.account.settings))}
          >
            <SettingsIcon className="text-foreground size-5" />
            <span>{content.profileSettings}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="px-4 py-2.5 text-base"
            onClick={() => startNextStep(WELCOME_TOUR)}
          >
            <CompassIcon className="text-foreground size-5" />
            <span>{tour.replay}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="px-4 py-2.5 text-base"
          onClick={handleSignOut}
        >
          <LogOutIcon className="size-5" />
          <span>{content.profileLogout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
