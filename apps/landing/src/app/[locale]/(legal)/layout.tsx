import type { ReactNode } from "react";

import { PageContainer } from "@wowlab/shared/components/common/page-container";

export default function LegalLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <PageContainer maxW="3xl">{children}</PageContainer>;
}
