import { useIntlayer } from "next-intlayer/server";
import Link from "next/link";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@wowlab/shared/components/ui/breadcrumb";

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

type PageBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function PageBreadcrumbs({ items }: Readonly<PageBreadcrumbsProps>) {
  const content = useIntlayer("commonComponents");

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb aria-label={content.breadcrumbAriaLabel.value}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const itemKey = `${item.href ?? "text"}-${index}`;

          return (
            <Fragment key={itemKey}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
