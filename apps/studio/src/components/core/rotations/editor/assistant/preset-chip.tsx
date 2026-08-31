"use client";

import type { ReactNode } from "react";

import { Button } from "@wowlab/shared/components/ui/button";

export function PresetChip({
  active,
  children,
  onClick,
}: Readonly<{ active?: boolean; children: ReactNode; onClick: () => void }>) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "outline"}
      className="h-7 rounded-full px-3 text-xs"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
