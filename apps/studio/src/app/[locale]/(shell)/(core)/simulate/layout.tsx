import type { ReactNode } from "react";

import { connection } from "next/server";

import { requireServerClaims } from "@wowlab/shared/lib/supabase/server";

export default async function SimulateLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  await requireServerClaims();

  return children;
}
