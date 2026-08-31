import { StatGrid } from "@/components/shared/layout";
import { SkeletonCard } from "@wowlab/shared/components/common/skeleton-blocks";

export function StatCardsSkeleton() {
  return (
    <StatGrid>
      {Array.from({ length: 3 }, (_, index) => (
        <SkeletonCard bodyLines={1} headerWidth="w-24" key={index} />
      ))}
    </StatGrid>
  );
}
