import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";

type DocArticleLayoutProps = {
  breadcrumb: ReactNode;
  children: ReactNode;
};

export default function DocArticleLayout({
  breadcrumb,
  children,
}: Readonly<DocArticleLayoutProps>) {
  return <PageContainer breadcrumbs={breadcrumb}>{children}</PageContainer>;
}
