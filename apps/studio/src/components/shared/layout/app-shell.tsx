"use client";

import type { ReactNode } from "react";

import { ConfirmDialogHost } from "@/components/shared/ui/confirm-dialog";
import { TooltipProvider } from "@wowlab/shared/components/ui/tooltip";

import { DashboardShell } from "./dashboard-shell";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: Readonly<AppShellProps>) {
  return (
    <TooltipProvider>
      <DashboardShell>{children}</DashboardShell>
      <ConfirmDialogHost />
    </TooltipProvider>
  );
}
