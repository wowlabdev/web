"use client";

import type { ReactNode } from "react";

import { useLocale } from "next-intlayer";

import { PageContainer } from "@wowlab/shared/components/common";
import { breadcrumb, getRouteByPath, routes } from "@wowlab/shared/lib/routing";

import { AdminNav } from "./admin-nav";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: Readonly<AdminShellProps>) {
  const { pathWithoutLocale } = useLocale();
  const activeRoute =
    getRouteByPath(pathWithoutLocale) ?? routes.admin.overview;

  return (
    <PageContainer
      route={activeRoute}
      breadcrumbs={breadcrumb(
        routes.home,
        routes.admin.index,
        activeRoute.label,
      )}
      maxW="8xl"
    >
      <div className="space-y-6">
        <AdminNav />
        {children}
      </div>
    </PageContainer>
  );
}
