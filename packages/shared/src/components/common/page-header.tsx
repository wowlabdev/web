import type { ReactNode } from "react";

import type { Route } from "@wowlab/shared/lib/routing";

import type { BreadcrumbItem } from "./page-breadcrumbs";

import { HeaderPanel } from "./header-panel";
import { PageBreadcrumbs } from "./page-breadcrumbs";

type PageHeaderProps = {
  breadcrumbs?: BreadcrumbItem[] | ReactNode;
  children?: ReactNode;
  route: Route;
};

export function PageHeader({
  breadcrumbs,
  children,
  route,
}: Readonly<PageHeaderProps>) {
  const normalizedBreadcrumbs = Array.isArray(breadcrumbs)
    ? compactBreadcrumbs(breadcrumbs, route.label)
    : null;
  let breadcrumbContent: ReactNode = null;

  if (!Array.isArray(breadcrumbs)) {
    breadcrumbContent = breadcrumbs;
  } else if (normalizedBreadcrumbs && normalizedBreadcrumbs.length > 0) {
    breadcrumbContent = <PageBreadcrumbs items={normalizedBreadcrumbs} />;
  }

  return (
    <div id="tour-page-header">
      <HeaderPanel
        title={route.label}
        description={route.description}
        breadcrumbs={breadcrumbContent}
        railColor={route.railColor}
        actions={children}
      />
    </div>
  );
}

function compactBreadcrumbs(items: BreadcrumbItem[], routeLabel: string) {
  if (items.length === 0) {
    return items;
  }

  const lastItem = items.at(-1)!;

  if (lastItem.label.trim().toLowerCase() !== routeLabel.trim().toLowerCase()) {
    return items;
  }

  return items.slice(0, -1);
}
