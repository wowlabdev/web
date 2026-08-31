"use client";

import { ChevronRightIcon } from "lucide-react";
import { useIntlayer, useLocale } from "next-intlayer";
import { createElement } from "react";

import type {
  NavGroup,
  NavSectionKey,
  Route,
} from "@wowlab/shared/lib/routing";

import { Badge } from "@wowlab/shared/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@wowlab/shared/components/ui/collapsible";
import { Link } from "@wowlab/shared/components/ui/link";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@wowlab/shared/components/ui/sidebar";
import { getIcon, href, navigation } from "@wowlab/shared/lib/routing";

export function DashboardSidebarNav() {
  const content = useIntlayer("dashboardLayout");
  const { pathWithoutLocale } = useLocale();

  const sectionLabel = {
    core: content.navCore,
    developer: content.navDeveloper,
    external: content.navExternal,
    internal: content.navInternal,
  } satisfies Record<NavSectionKey, unknown>;

  return (
    <>
      {navigation.map((section) => (
        <SidebarGroup key={section.key}>
          <SidebarGroupLabel className="text-foreground/45 text-[10px] font-medium uppercase tracking-wider">
            {sectionLabel[section.key]}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.groups.map((group) => (
                <NavGroupItem
                  key={group.route.path}
                  group={group}
                  isExternal={section.isExternal}
                  pathWithoutLocale={pathWithoutLocale}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}

function NavGroupItem({
  group,
  isExternal,
  pathWithoutLocale,
}: Readonly<{
  group: NavGroup;
  isExternal: boolean;
  pathWithoutLocale: string;
}>) {
  const { route } = group;

  if (isExternal) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={route.description} asChild>
          <a href={route.path} target="_blank" rel="noopener noreferrer">
            {createElement(getIcon(route.icon))}
            <span>{route.label}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  const isActive =
    pathWithoutLocale === route.path ||
    pathWithoutLocale.startsWith(`${route.path}/`);

  if (group.items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={route.description}
          isActive={isActive}
          asChild
        >
          <Link href={href(route)}>
            {createElement(getIcon(route.icon))}
            <span>{route.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible className="group/collapsible" defaultOpen={isActive}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={route.description} isActive={isActive}>
            {createElement(getIcon(route.icon))}
            <span>{route.label}</span>
            <ChevronRightIcon className="ml-auto transition-transform duration-150 ease-out group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {group.items.map((item) => (
              <NavSubItem
                key={item.path}
                item={item}
                isActive={pathWithoutLocale === item.path}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function NavSubItem({
  isActive,
  item,
}: Readonly<{ item: Route; isActive: boolean }>) {
  const content = useIntlayer("dashboardLayout");

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton isActive={isActive} asChild>
        <Link href={href(item)}>
          {createElement(getIcon(item.icon))}
          <span>{item.label}</span>
          {item.isPreview && (
            <Badge variant="outline" className="ml-auto text-[10px] px-1 py-0">
              {content.navPreviewBadge}
            </Badge>
          )}
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
