"use client";

import { useMemoizedFn } from "ahooks";
import { getLocalizedUrl } from "intlayer";
import { useLocale } from "next-intlayer";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export function useLocalizedRouter() {
  const router = useRouter();
  const { locale } = useLocale();

  const push = useMemoizedFn((url: string) => {
    router.push(getLocalizedUrl(url, locale));
  });

  const replace = useMemoizedFn((url: string) => {
    router.replace(getLocalizedUrl(url, locale));
  });

  return useMemo(
    () => ({
      ...router,
      push,
      replace,
    }),
    [router, push, replace],
  );
}
