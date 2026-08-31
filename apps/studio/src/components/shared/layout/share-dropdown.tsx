"use client";

import type { ReactNode } from "react";

import { InfoIcon, LinkIcon, MoreHorizontalIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@wowlab/shared/components/ui/avatar";
import { Button } from "@wowlab/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@wowlab/shared/components/ui/dropdown-menu";
import { Input } from "@wowlab/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wowlab/shared/components/ui/select";
type ShareDropdownProps = {
  align?: "start" | "center" | "end";
  data: {
    email: string;
    img: string;
    name: string;
    role: string;
  }[];
  isDefaultOpen?: boolean;
  morePeople?: {
    img: string;
    name: string;
  }[];
  trigger: ReactNode;
};

export function ShareDropdown({
  align = "end",
  data,
  isDefaultOpen,
  morePeople,
  trigger,
}: Readonly<ShareDropdownProps>) {
  const content = useIntlayer("dashboardLayout");

  return (
    <DropdownMenu defaultOpen={isDefaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-xs sm:w-116" align={align}>
        <DropdownMenuLabel className="text-muted-foreground font-normal uppercase">
          {content.shareTitle}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="mt-4 flex flex-col gap-3 px-2">
          <div className="flex items-center gap-2.5">
            <Input
              type="email"
              placeholder={content.shareEmailPlaceholder.value}
              className="h-8"
            />
            <Button size="sm">{content.shareSend}</Button>
          </div>
          <p className="text-sm font-medium">{content.shareTeamMembers}</p>
          <div className="flex flex-col gap-3">
            {data.map((item) => (
              <div
                key={item.email}
                className="flex flex-wrap items-center gap-4 px-3 py-1"
              >
                <Avatar className="size-9.5">
                  <AvatarImage src={item.img} />
                  <AvatarFallback>{toInitials(item.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex flex-1 flex-col items-start">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">{item.email}</p>
                  </div>
                  <Select defaultValue={item.role}>
                    <SelectTrigger
                      size="sm"
                      className="border-0 px-2 shadow-none"
                    >
                      <SelectValue
                        placeholder={content.shareRoleSelectPlaceholder.value}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="owner">
                          {content.shareRoleOwner}
                        </SelectItem>
                        <SelectItem value="admin">
                          {content.shareRoleAdmin}
                        </SelectItem>
                        <SelectItem value="can-edit">
                          {content.shareRoleCanEdit}
                        </SelectItem>
                        <SelectItem value="can-view">
                          {content.shareRoleCanView}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
            {morePeople && (
              <div className="flex items-center gap-4 px-3 py-1">
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                  {morePeople.map((person) => (
                    <Avatar key={person.name} className="size-7">
                      <AvatarImage src={person.img} />
                      <AvatarFallback>{toInitials(person.name)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <p className="text-muted-foreground flex-1">
                  {content.shareMorePeople(morePeople.length)}
                </p>
                <MoreHorizontalIcon className="size-4" />
              </div>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="flex items-center gap-4 px-2 py-1">
          <div className="text-muted-foreground flex flex-1 items-center gap-1.5">
            <InfoIcon className="size-4" />
            <span className="text-sm">{content.shareReadMore}</span>
          </div>
          <Button variant="ghost" size="sm">
            <LinkIcon />
            {content.shareCopyLink}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function toInitials(name: string): string {
  return name
    .split(/\s/)
    .reduce((result, word) => result + word.slice(0, 1), "");
}
