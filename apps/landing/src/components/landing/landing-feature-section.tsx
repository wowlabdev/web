import type { ReactNode } from "react";

import { CircleCheckIcon } from "lucide-react";

import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
} from "@wowlab/shared/components/ui/item";
import { Link } from "@wowlab/shared/components/ui/link";
import { MotionPreset } from "@wowlab/shared/components/ui/motion-preset";
import { cn } from "@wowlab/shared/lib/utils";

export type LandingFeatureSectionData = {
  badge: ReactNode;
  description: ReactNode;
  features: {
    description: ReactNode;
    href?: string;
    id: string;
    title: ReactNode;
  }[];
  id: string;
  media?: ReactNode;
  title: ReactNode;
};

export function LandingFeatureSection({
  imageDirection,
  imageJustify,
  imageOrder,
  section,
  textOrder,
}: Readonly<{
  imageDirection: "left" | "right";
  imageJustify: string;
  imageOrder: string;
  section: LandingFeatureSectionData;
  textOrder: string;
}>) {
  const hasMedia = section.media !== undefined;

  return (
    <div
      className={cn(
        "grid items-center gap-12",
        hasMedia && "lg:grid-cols-2 lg:gap-24",
      )}
    >
      <MotionPreset fade slide className={cn("space-y-6", textOrder)}>
        <div className="space-y-4">
          <p className="text-primary text-sm font-medium uppercase">
            {section.badge}
          </p>
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            {section.title}
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            {section.description}
          </p>
        </div>

        <ItemGroup className="gap-3.5">
          {section.features.map((feature) => {
            const body = (
              <>
                <ItemMedia>
                  <CircleCheckIcon className="text-primary size-6" />
                </ItemMedia>
                <ItemContent className="flex-row">
                  <p className="text-base md:text-lg">
                    <span className="font-medium">{feature.title}</span>{" "}
                    <span className="text-muted-foreground">
                      {feature.description}
                    </span>
                  </p>
                </ItemContent>
              </>
            );

            return feature.href ? (
              <Item
                key={feature.id}
                asChild
                className="items-start gap-3 rounded-none p-0"
              >
                <Link
                  href={feature.href}
                  className="group/feature hover:[&_.font-medium]:underline"
                >
                  {body}
                </Link>
              </Item>
            ) : (
              <Item
                key={feature.id}
                className="items-start gap-3 rounded-none p-0"
              >
                {body}
              </Item>
            );
          })}
        </ItemGroup>
      </MotionPreset>

      {hasMedia && (
        <MotionPreset
          fade
          slide={{ direction: imageDirection, offset: 24 }}
          delay={0.1}
          className={cn("flex justify-center", imageJustify, imageOrder)}
        >
          {section.media}
        </MotionPreset>
      )}
    </div>
  );
}
