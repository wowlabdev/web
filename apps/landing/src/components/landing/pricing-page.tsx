import { useIntlayer } from "next-intlayer/server";

import { ArticleHeader } from "@wowlab/shared/components/content/article-header";
import { MotionPreset } from "@wowlab/shared/components/ui/motion-preset";
import { env } from "@wowlab/shared/lib/env";

import { FREE_PLAN, INDIVIDUAL_PLAN } from "./pricing-plans";
import { BoostPackSelector } from "./pricing/boost-pack-selector";
import { DiscountInput } from "./pricing/discount-input";
import { GuildPlanCard } from "./pricing/guild-plan-card";
import { PlanCard, type PricingPlan } from "./pricing/plan-card";
import { PricingFaq } from "./pricing/pricing-faq";

export function PricingPage() {
  const content = useIntlayer("pricingPage");

  const plans: PricingPlan[] = [
    {
      buttonText: content.freeCta,
      description: content.freeDescription,
      features: [
        { available: true, key: "free-1", title: content.freeFeature1 },
        { available: true, key: "free-2", title: content.freeFeature2 },
        { available: true, key: "free-3", title: content.freeFeature3 },
        { available: true, key: "free-4", title: content.freeFeature4 },
        { available: true, key: "free-5", title: content.freeFeature5 },
      ],
      name: content.freeName,
      price: FREE_PLAN.price,
      priceSuffix: content.freePriceSuffix,
    },
    {
      badge: content.individualBadge,
      buttonText: content.individualCta,
      checkout: { plan: "individual", priceId: env.PADDLE_PRICE_INDIVIDUAL },
      description: content.individualDescription,
      features: [
        {
          available: true,
          key: "individual-1",
          title: content.individualFeature1,
        },
        {
          available: true,
          key: "individual-2",
          title: content.individualFeature2,
        },
        {
          available: true,
          key: "individual-3",
          title: content.individualFeature3,
        },
        {
          available: true,
          key: "individual-4",
          title: content.individualFeature4,
        },
        {
          available: true,
          key: "individual-5",
          title: content.individualFeature5,
        },
      ],
      highlighted: INDIVIDUAL_PLAN.highlighted,
      name: content.individualName,
      price: INDIVIDUAL_PLAN.price,
      priceId: INDIVIDUAL_PLAN.priceId,
      priceSuffix: content.individualPriceSuffix,
    },
  ];

  return (
    <div className="space-y-6">
      <MotionPreset
        fade
        slide={{ direction: "down", offset: 20 }}
        transition={{ duration: 0.4 }}
      >
        <ArticleHeader
          prose
          title={content.title}
          description={content.intro}
        />
      </MotionPreset>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan, index) => (
          <MotionPreset
            key={plan.checkout?.plan ?? "free"}
            fade
            slide={{ direction: "down", offset: 24 }}
            delay={0.06 * (index + 1)}
            transition={{ duration: 0.4 }}
            className="flex"
          >
            <div className="w-full">
              <PlanCard plan={plan} />
            </div>
          </MotionPreset>
        ))}
        <MotionPreset
          fade
          slide={{ direction: "down", offset: 24 }}
          delay={0.06 * (plans.length + 1)}
          transition={{ duration: 0.4 }}
          className="flex"
        >
          <div className="w-full">
            <GuildPlanCard />
          </div>
        </MotionPreset>
      </div>

      <MotionPreset
        fade
        slide={{ direction: "down", offset: 20 }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{content.boostSectionTitle}</h2>
          <p className="text-muted-foreground text-sm">
            {content.boostSectionDescription}
          </p>
        </div>
        <BoostPackSelector />
      </MotionPreset>

      <MotionPreset
        fade
        slide={{ direction: "down", offset: 20 }}
        transition={{ duration: 0.4 }}
      >
        <DiscountInput />
      </MotionPreset>

      <MotionPreset
        fade
        slide={{ direction: "down", offset: 20 }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <PricingFaq />
      </MotionPreset>
    </div>
  );
}
