"use client";

import { useIntlayer } from "next-intlayer";
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
import { href, routes } from "@wowlab/shared/lib/routing";

type EditorToolbarBreadcrumbProps = {
  current: string;
};

export function EditorToolbarBreadcrumb({
  current,
}: Readonly<EditorToolbarBreadcrumbProps>) {
  const content = useIntlayer("rotationEditor");

  const items: { href?: string; label: string }[] = [
    {
      href: href(routes.rotations.index),
      label: content.breadcrumbRotations.value,
    },
    {
      href: href(routes.rotations.editor.index),
      label: content.breadcrumbEditor.value,
    },
    { label: current },
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const itemKey = `${item.href ?? "text"}-${index}`;

          return (
            <Fragment key={itemKey}>
              <BreadcrumbItem className={index === 0 ? "hidden sm:flex" : ""}>
                {item.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator
                  className={
                    index === 0
                      ? "hidden text-muted-foreground/50 sm:flex"
                      : "text-muted-foreground/50"
                  }
                >
                  /
                </BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
