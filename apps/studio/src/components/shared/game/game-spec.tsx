"use client";

import { useIntlayer } from "next-intlayer";

import type { SpecRow } from "@/lib/game-data";

import { useClass, useSpec } from "@/lib/game-data";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { cn } from "@wowlab/shared/lib/utils";

import { GameIcon, ICON_SKELETON_SIZE } from "./game-icon";

export type GameSpecProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  specId: number;
};

export function GameSpec({
  className,
  size = "sm",
  specId,
}: Readonly<GameSpecProps>) {
  const content = useIntlayer("gameComponents");
  const { data: spec, isError, isLoading } = useSpec(specId);

  if (isLoading) {
    return <GameSpecSkeleton className={className} size={size} />;
  }

  if (isError || !spec) {
    return (
      <span className="text-muted-foreground text-sm">
        {content.specFallback({ id: specId })}
      </span>
    );
  }

  return <GameSpecLoaded className={className} size={size} spec={spec} />;
}

function GameSpecLoaded({
  className,
  size = "sm",
  spec,
}: Readonly<{
  className?: string;
  size?: "sm" | "md" | "lg";
  spec: SpecRow;
}>) {
  const { data: cls } = useClass(spec.class_id);

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <GameIcon iconName={spec.file_name} size={size} />
      <span className="font-medium" style={{ color: cls?.color ?? undefined }}>
        {spec.class_name}
      </span>
      <span className="text-muted-foreground">&rsaquo;</span>
      <span>{spec.name}</span>
    </span>
  );
}

function GameSpecSkeleton({
  className,
  size = "sm",
}: Readonly<{
  className?: string;
  size?: "sm" | "md" | "lg";
}>) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Skeleton className={cn("rounded-sm", ICON_SKELETON_SIZE[size])} />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-24" />
    </span>
  );
}
