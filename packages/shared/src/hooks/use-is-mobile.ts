import { useEventListener, useMount } from "ahooks";
import { useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>();

  useMount(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  });

  useEventListener("resize", () => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  });

  return !!isMobile;
}
