import { BriefcaseIcon, PackageIcon, ZapIcon } from "lucide-react";
import { useIntlayer } from "next-intlayer/server";

import { FeatureGrid } from "@wowlab/shared/components/common/feature-grid";
import { href } from "@wowlab/shared/lib/routing";
import { routes } from "@wowlab/shared/lib/routing/routes";

export function SimulateIndexPage() {
  const content = useIntlayer("simulateShared");

  const tools = [
    {
      description: content.indexQuickDescription,
      href: href(routes.simulate.quick),
      icon: <ZapIcon className="size-5" />,
      key: "quick",
      title: content.indexQuickTitle,
    },
    {
      description: content.indexBagsDescription,
      href: href(routes.simulate.bags),
      icon: <BriefcaseIcon className="size-5" />,
      key: "bags",
      title: content.indexBagsTitle,
    },
    {
      description: content.indexDropsDescription,
      href: href(routes.simulate.drops),
      icon: <PackageIcon className="size-5" />,
      key: "drops",
      title: content.indexDropsTitle,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="max-w-2xl space-y-1">
        <p className="text-muted-foreground text-sm">{content.indexIntro}</p>
      </div>

      <FeatureGrid columns={3} featuresList={tools} />
    </div>
  );
}
