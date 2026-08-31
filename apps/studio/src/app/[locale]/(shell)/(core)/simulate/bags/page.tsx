import { BagsContent } from "@/components/core/simulate/bags/bags-content";
import { ErrorBoundary } from "@wowlab/shared/components/error-boundary";

export default function BagsPage() {
  return (
    <ErrorBoundary>
      <BagsContent />
    </ErrorBoundary>
  );
}
