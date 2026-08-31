import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";

type BibleArticleLayoutProps = {
  breadcrumb: ReactNode;
  children: ReactNode;
};

export default function BibleArticleLayout({
  breadcrumb,
  children,
}: Readonly<BibleArticleLayoutProps>) {
  return <PageContainer breadcrumbs={breadcrumb}>{children}</PageContainer>;
}
