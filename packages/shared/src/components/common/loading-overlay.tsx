import type { ReactNode } from "react";

import { LogoSpinner } from "@wowlab/shared/components/ui/logo-spinner";
import { cn } from "@wowlab/shared/lib/utils";

export function LoadingOverlay({
  blur = true,
  children,
  className,
  label,
  loading,
  overlayClassName,
}: Readonly<{
  blur?: boolean;
  children: ReactNode;
  className?: string;
  label?: ReactNode;
  loading: boolean;
  overlayClassName?: string;
}>) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {loading && (
        <div
          role="status"
          className={cn(
            "bg-background/60 absolute inset-0 z-10 flex flex-col items-center justify-center gap-2",
            blur && "backdrop-blur-[1px]",
            overlayClassName,
          )}
        >
          <LogoSpinner className="size-8" />
          {label != null && (
            <span className="text-xs font-medium">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}
