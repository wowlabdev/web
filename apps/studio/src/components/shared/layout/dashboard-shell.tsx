"use client";

import type { ReactNode } from "react";

import { PastDueBanner } from "@/components/account/billing/past-due-banner";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@wowlab/shared/components/ui/sidebar";

import { DashboardContentFooter } from "./dashboard-content-footer";
import { DashboardHeaderToolbar } from "./dashboard-header-toolbar";
import { DashboardSidebarFooter } from "./dashboard-sidebar-footer";
import { DashboardSidebarHeader } from "./dashboard-sidebar-header";
import { DashboardSidebarNav } from "./dashboard-sidebar-nav";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: Readonly<DashboardShellProps>) {
  return (
    <div className="flex min-h-dvh w-full">
      <SidebarProvider>
        <Sidebar
          collapsible="icon"
          className="[&>[data-slot=sidebar-container]]:after:pointer-events-none [&>[data-slot=sidebar-container]]:after:absolute [&>[data-slot=sidebar-container]]:after:inset-y-0 [&>[data-slot=sidebar-container]]:after:right-0 [&>[data-slot=sidebar-container]]:after:w-px [&>[data-slot=sidebar-container]]:after:bg-linear-to-b [&>[data-slot=sidebar-container]]:after:from-transparent [&>[data-slot=sidebar-container]]:after:via-border/40 [&>[data-slot=sidebar-container]]:after:to-transparent"
        >
          <DashboardSidebarHeader />
          <SidebarContent id="tour-sidebar-nav">
            <DashboardSidebarNav />
          </SidebarContent>
          <DashboardSidebarFooter />
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <DashboardHeaderToolbar />
          <PastDueBanner />
          <main className="size-full flex-1 fl-px-4/6 py-6">{children}</main>
          <DashboardContentFooter />
        </div>
      </SidebarProvider>
    </div>
  );
}
