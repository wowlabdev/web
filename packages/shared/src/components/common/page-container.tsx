import type { ReactNode } from "react";

import { BreadcrumbJsonLd } from "next-seo";

import type { Route } from "@wowlab/shared/lib/routing";
import type { SeoHost } from "@wowlab/shared/lib/seo/urls";

import { hostUrl } from "@wowlab/shared/lib/seo/urls";
import { cn } from "@wowlab/shared/lib/utils";

import type { BreadcrumbItem } from "./page-breadcrumbs";

import { PageBreadcrumbs } from "./page-breadcrumbs";
import { PageHeader } from "./page-header";

type MaxWidth = "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl";

const MAX_WIDTH_CLASSES: Record<MaxWidth, string> = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  "8xl": "max-w-8xl",
};

const PY_CLASSES = new Map([
  ["10", "fl-py-4/10"],
  ["12", "fl-py-4/12"],
  ["4", "py-4"],
  ["6", "fl-py-4/6"],
  ["8", "fl-py-4/8"],
]);

type PageContainerProps = {
  breadcrumbs?: BreadcrumbItem[] | ReactNode;
  children: ReactNode;
  headerActions?: ReactNode;
  host?: SeoHost;
  maxW?: MaxWidth;
  py?: "4" | "6" | "8" | "10" | "12";
  route?: Route;
};

export function PageContainer({
  breadcrumbs,
  children,
  headerActions,
  host = "app",
  maxW = "7xl",
  py = "6",
  route,
}: Readonly<PageContainerProps>) {
  const breadcrumbContent = Array.isArray(breadcrumbs) ? (
    <PageBreadcrumbs items={breadcrumbs} />
  ) : (
    breadcrumbs
  );

  const hasHeader = route || breadcrumbContent;
  const jsonLdItems = Array.isArray(breadcrumbs)
    ? breadcrumbs.map((item) => ({
        item: item.href ? hostUrl(host, item.href) : undefined,
        name: item.label,
      }))
    : null;

  return (
    <div
      className={cn(
        "mx-auto w-full fl-px-3/4",
        MAX_WIDTH_CLASSES[maxW],
        PY_CLASSES.get(py),
      )}
    >
      {jsonLdItems ? <BreadcrumbJsonLd items={jsonLdItems} /> : null}
      {hasHeader ? (
        <div className="flex flex-col gap-4">
          {route ? (
            <PageHeader route={route} breadcrumbs={breadcrumbs}>
              {headerActions}
            </PageHeader>
          ) : (
            breadcrumbContent
          )}
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
