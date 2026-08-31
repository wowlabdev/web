import { ErrorPageNotFound } from "@wowlab/shared/components/common/errors";

// Runs outside the [locale] segment with no IntlayerProvider, so strings stay English.
export default function NotFound() {
  return (
    <ErrorPageNotFound
      actionLabel="Back to home"
      description="It might have moved, or it never existed. Either way, here's the way back."
      subtitle="I can't find that page."
    />
  );
}
