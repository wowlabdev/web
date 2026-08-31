"use client";

import { useMemoizedFn, useSetState } from "ahooks";
import { ChevronLeftIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer";
import { useMemo } from "react";

import { GameIcon } from "@/components/shared/game/game-icon";
import { Skeleton } from "@wowlab/shared/components/common/skeleton-blocks";
import { cn } from "@wowlab/shared/lib/utils";

import type { SpecPickerProps } from "./spec-picker-types";

import { useSpecClassGroups } from "./use-spec-class-groups";

type SpecPickerGridProps = {
  dense?: boolean;
} & Omit<SpecPickerProps, "isCompact">;

export function SpecPickerGrid({
  dense = false,
  onChange,
  specs,
  value,
}: Readonly<SpecPickerGridProps>) {
  const content = useIntlayer("gameComponents");
  const groups = useSpecClassGroups(specs);
  const [nav, setNav] = useSetState<{
    navigated: boolean;
    viewedClass: null | string;
  }>({ navigated: false, viewedClass: null });

  const selectedClass = useMemo(
    () =>
      groups.find((group) => group.specs.some((spec) => spec.specId === value))
        ?.className ?? null,
    [groups, value],
  );

  const showGrid = useMemoizedFn(() =>
    setNav({ navigated: true, viewedClass: null }),
  );
  const showClass = useMemoizedFn((className: string) =>
    setNav({ navigated: true, viewedClass: className }),
  );

  const shownClass = nav.navigated ? nav.viewedClass : selectedClass;
  const activeGroup =
    groups.find((group) => group.className === shownClass) ?? null;

  const iconSize = dense ? "md" : "lg";
  const containerClass = dense
    ? "w-72 rounded-lg p-2"
    : "w-full max-w-md rounded-lg border bg-card p-4";

  if (groups.length === 0) {
    return (
      <Skeleton
        className={cn("w-full max-w-md rounded-lg", dense ? "h-40" : "h-52")}
      />
    );
  }

  if (!activeGroup) {
    return (
      <div className={containerClass}>
        <div
          className={cn(
            "grid grid-cols-6 sm:grid-cols-6",
            dense ? "gap-1" : "gap-2 grid-cols-4",
          )}
        >
          {groups.map((group) => (
            <button
              className={cn(
                "flex flex-col items-center gap-1 rounded-md transition-colors hover:bg-accent",
                dense ? "p-1" : "p-2",
              )}
              key={group.className}
              onClick={() => showClass(group.className)}
              title={group.className}
              type="button"
            >
              {group.iconName && (
                <GameIcon
                  alt={group.className}
                  iconName={group.iconName}
                  size={iconSize}
                />
              )}
              {!dense && (
                <span
                  className="text-center text-xs leading-tight"
                  style={group.color ? { color: group.color } : undefined}
                >
                  {group.className}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <button
        className={cn(
          "flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground",
          dense ? "mb-2" : "mb-3",
        )}
        onClick={showGrid}
        type="button"
      >
        <ChevronLeftIcon className="size-4" />
        {content.backToClasses}
      </button>
      <div
        className={cn(
          "flex flex-wrap justify-center",
          dense ? "gap-1" : "gap-2",
        )}
      >
        {activeGroup.specs.map((spec) => (
          <button
            className={cn(
              "flex flex-col items-center gap-1 rounded-md transition-colors hover:bg-accent",
              dense ? "w-16 p-1" : "w-20 p-1.5",
              spec.specId === value && "bg-accent ring-2 ring-primary",
            )}
            key={spec.specId}
            onClick={() => onChange(spec.specId)}
            type="button"
          >
            {spec.fileName && (
              <GameIcon
                alt={spec.specName}
                iconName={spec.fileName}
                size={iconSize}
              />
            )}
            <span
              className={cn(
                "flex items-center text-center text-xs leading-tight",
                dense ? "min-h-6" : "min-h-8",
              )}
            >
              {spec.specName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
