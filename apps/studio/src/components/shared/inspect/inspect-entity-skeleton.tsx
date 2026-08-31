import { SkeletonMedia } from "@wowlab/shared/components/common/skeleton-blocks";

export function InspectEntitySkeleton() {
  return (
    <SkeletonMedia
      iconClassName="size-14 rounded-sm"
      titleClassName="h-8 w-56"
      subtitleClassName="h-4 w-12"
    />
  );
}
