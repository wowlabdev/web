"use client";

import type { Step, Tour } from "nextstepjs";

import { useIntlayer, useLocale } from "next-intlayer";

import { getLocalizedUrl, href } from "@wowlab/shared/lib/routing";
import { routes } from "@wowlab/shared/lib/routing/routes";

export const WELCOME_TOUR = "welcome-tour";

type StepConfig = {
  content: string;
  nextRoute?: string;
  pointerPadding?: number;
  prevRoute?: string;
  selector: string;
  side: Step["side"];
  title: string;
};

export function useTourSteps(): Tour[] {
  const copy = useIntlayer("onboardingTour");
  const { locale } = useLocale();
  const at = (path: string) => getLocalizedUrl(path, locale);

  const home = at(href(routes.home));
  const simulate = at(href(routes.simulate.quick));
  const rotations = at(href(routes.rotations.browse));
  const plan = at(href(routes.plan.traits));
  const rankings = at(href(routes.rankings.specs));
  const journal = at(href(routes.journal));
  const account = at(href(routes.account.billing.index));
  const runtime = at(href(routes.int.runtime));

  // prettier-ignore
  return [
    {
      steps: [
        step({ content: copy.welcomeContent.value, selector: "#tour-welcome", side: "bottom", title: copy.welcomeTitle.value }),
        step({ content: copy.newSimContent.value, selector: "#tour-new-sim", side: "bottom-right", title: copy.newSimTitle.value }),
        step({ content: copy.recentSimsContent.value, pointerPadding: 12, selector: "#tour-recent-sims", side: "top", title: copy.recentSimsTitle.value }),
        step({ content: copy.sidebarContent.value, pointerPadding: 12, selector: "#tour-sidebar-nav", side: "right", title: copy.sidebarTitle.value }),
        step({ content: copy.searchContent.value, nextRoute: simulate, selector: "#tour-search", side: "bottom-left", title: copy.searchTitle.value }),
        step({ content: copy.simulateContent.value, nextRoute: rotations, prevRoute: home, selector: "#simc-input", side: "top", title: copy.simulateTitle.value }),
        step({ content: copy.rotationsContent.value, nextRoute: plan, prevRoute: simulate, selector: "#tour-page-header", side: "bottom", title: copy.rotationsTitle.value }),
        step({ content: copy.planContent.value, nextRoute: rankings, prevRoute: rotations, selector: "#tour-plan-talents", side: "bottom", title: copy.planTitle.value }),
        step({ content: copy.rankingsContent.value, nextRoute: journal, prevRoute: plan, selector: "#tour-page-header", side: "bottom", title: copy.rankingsTitle.value }),
        step({ content: copy.journalContent.value, nextRoute: account, prevRoute: rankings, selector: "#tour-journal-tree", side: "right", title: copy.journalTitle.value }),
        step({ content: copy.boostsContent.value, prevRoute: journal, selector: "#tour-account-boosts", side: "top", title: copy.boostsTitle.value }),
        step({ content: copy.engineContent.value, nextRoute: runtime, selector: "#tour-engine-status", side: "top-left", title: copy.engineTitle.value }),
        step({ content: copy.runtimeContent.value, prevRoute: account, selector: "#tour-runtime", side: "bottom-left", title: copy.runtimeTitle.value }),
        step({ content: copy.accountContent.value, selector: "#tour-account", side: "bottom-right", title: copy.accountTitle.value }),
      ],
      tour: WELCOME_TOUR,
    },
  ];
}

function step({
  content,
  nextRoute,
  pointerPadding = 8,
  prevRoute,
  selector,
  side,
  title,
}: StepConfig): Step {
  return {
    content,
    icon: null,
    nextRoute,
    pointerPadding,
    pointerRadius: 8,
    prevRoute,
    selector,
    showControls: true,
    showSkip: true,
    side,
    title,
  };
}
