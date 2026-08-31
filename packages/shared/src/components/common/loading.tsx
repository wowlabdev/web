import type { ReactNode } from "react";

import type { LogoTone } from "@wowlab/shared/components/ui/logo-mark";

import { LogoSpinner } from "@wowlab/shared/components/ui/logo-spinner";
import { cn } from "@wowlab/shared/lib/utils";

const SPINNER_SIZE: Record<"sm" | "md" | "lg", string> = {
  lg: "size-16",
  md: "size-10",
  sm: "size-6",
};

export function Loading({
  className,
  label,
  size = "md",
  tone,
}: Readonly<{
  className?: string;
  label?: ReactNode;
  size?: "sm" | "md" | "lg";
  tone?: LogoTone;
}>) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 text-center",
        className,
      )}
    >
      <LogoSpinner className={SPINNER_SIZE[size]} tone={tone} />
      {label != null && (
        <span className="text-muted-foreground text-xs">{label}</span>
      )}
    </div>
  );
}
