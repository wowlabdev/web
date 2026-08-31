import { PermutationsContent } from "@/components/int/permutations";
import { ErrorBoundary } from "@wowlab/shared/components/error-boundary";

export default function PermutationsPage() {
  return (
    <ErrorBoundary>
      <PermutationsContent />
    </ErrorBoundary>
  );
}
