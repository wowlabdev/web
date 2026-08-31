import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common/page-container";
import { routes } from "@wowlab/shared/lib/routing";

type BlogPostLayoutProps = {
  breadcrumb: ReactNode;
  children: ReactNode;
};

export default function BlogPostLayout({
  breadcrumb,
  children,
}: Readonly<BlogPostLayoutProps>) {
  return (
    <PageContainer
      host="landing"
      route={routes.blog.index}
      breadcrumbs={breadcrumb}
    >
      {children}
    </PageContainer>
  );
}
