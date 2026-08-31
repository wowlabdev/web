"use client";

import { useIntlayer } from "next-intlayer";
import Image from "next/image";

import { Link } from "@wowlab/shared/components/ui/link";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@wowlab/shared/components/ui/sidebar";
import { href, routes } from "@wowlab/shared/lib/routing";

export function DashboardSidebarHeader() {
  const content = useIntlayer("dashboardLayout");

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="gap-2.5 !bg-transparent [&>svg]:size-8"
            asChild
          >
            <Link href={href(routes.home)}>
              <Image
                src="/logo.png"
                alt={content.brandName.value}
                width={414}
                height={414}
                className="size-8 rounded-md"
                priority
              />
              <span className="text-xl font-semibold">{content.brandName}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
