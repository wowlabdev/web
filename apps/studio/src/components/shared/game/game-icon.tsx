"use client";

import type { ReactNode } from "react";

import Image from "next/image";

import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { makeIconUrl } from "@wowlab/shared/lib/links";
import { cn } from "@wowlab/shared/lib/utils";

export type GameIconProps = {
  alt?: string;
  className?: string;
  iconName: string;
  size?: "sm" | "md" | "lg";
};

const SIZE_DIMENSIONS = {
  lg: 56,
  md: 36,
  sm: 18,
} as const;

const SIZE_URLS = {
  lg: "large",
  md: "medium",
  sm: "small",
} as const;

export const ICON_SKELETON_SIZE = {
  lg: "size-[56px]",
  md: "size-[36px]",
  sm: "size-[18px]",
} as const;

export type GameLabelProps = {
  className?: string;
  fallback: string;
  href?: string;
  iconName?: string;
  loading?: boolean;
  name?: string;
  size?: NonNullable<GameIconProps["size"]>;
};

export function GameIcon({
  alt,
  className,
  iconName,
  size = "md",
}: Readonly<GameIconProps>) {
  const dimension = SIZE_DIMENSIONS[size];
  const url = makeIconUrl(iconName, SIZE_URLS[size]);

  return (
    <Image
      src={url}
      alt={alt ?? iconName}
      width={dimension}
      height={dimension}
      className={cn("rounded-sm bg-muted", className)}
    />
  );
}

export function GameLabel({
  className,
  fallback,
  href,
  iconName,
  loading,
  name,
  size = "sm",
}: Readonly<GameLabelProps>) {
  let content: ReactNode;

  if (loading) {
    content = (
      <>
        <Skeleton
          className={cn(
            "mr-1.5 inline-block align-middle rounded-sm",
            ICON_SKELETON_SIZE[size],
          )}
        />
        <Skeleton className="inline-block h-4 w-24 align-middle" />
      </>
    );
  } else if (iconName) {
    content = (
      <>
        <GameIcon
          iconName={iconName}
          size={size}
          alt={name}
          className="mr-1.5 inline-block align-middle"
        />
        <span className="text-sm">{name}</span>
      </>
    );
  } else {
    content = <span className="text-sm text-muted-foreground">{fallback}</span>;
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("whitespace-nowrap hover:underline", className)}
      >
        {content}
      </a>
    );
  }

  return <span className={cn("whitespace-nowrap", className)}>{content}</span>;
}
