import {
  LandingFeatureSection,
  type LandingFeatureSectionData,
} from "@/components/landing/landing-feature-section";

export function LandingFeatures({
  className,
  sections,
}: Readonly<{
  className?: string;
  sections: LandingFeatureSectionData[];
}>) {
  return (
    <section className={className ?? "py-8 sm:py-16 lg:py-24"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-24">
          {sections.map((section, index) => {
            const odd = index % 2 === 0;

            return (
              <LandingFeatureSection
                key={section.id}
                section={section}
                textOrder={odd ? "order-1" : "order-1 lg:order-2"}
                imageOrder={odd ? "order-2" : "order-2 lg:order-1"}
                imageDirection={odd ? "right" : "left"}
                imageJustify={odd ? "lg:justify-end" : "lg:justify-start"}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
