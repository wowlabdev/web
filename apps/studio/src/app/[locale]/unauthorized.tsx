"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { routes } from "@wowlab/shared/lib/routing/routes";
import { absoluteUrl, href } from "@wowlab/shared/lib/routing/utils";

export default function Unauthorized() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.replace(absoluteUrl(href(routes.auth.signIn), { next: pathname }));
  }, [pathname, router]);

  return null;
}
