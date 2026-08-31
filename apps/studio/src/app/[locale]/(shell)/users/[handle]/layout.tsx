import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common";

type UserProfileLayoutProps = {
  breadcrumb: ReactNode;
  children: ReactNode;
};

export default function UserProfileLayout({
  breadcrumb,
  children,
}: Readonly<UserProfileLayoutProps>) {
  return <PageContainer breadcrumbs={breadcrumb}>{children}</PageContainer>;
}
