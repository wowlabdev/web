import type { ReactNode } from "react";

import { unauthorized } from "next/navigation";
import { connection } from "next/server";

import { AdminShell } from "@/components/admin";
import { requireServerClaims } from "@wowlab/shared/lib/supabase/server";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await connection();

  const { supabase } = await requireServerClaims();
  const { data: isAdmin, error } = await supabase.rpc("is_admin");

  if (error) {
    throw error;
  }

  if (isAdmin !== true) {
    unauthorized();
  }

  return <AdminShell>{children}</AdminShell>;
}
