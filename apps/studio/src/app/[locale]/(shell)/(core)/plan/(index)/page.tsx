import { redirect } from "next/navigation";

import { href, routes } from "@wowlab/shared/lib/routing";

export default function PlanIndexRoute() {
  redirect(href(routes.plan.traits));
}
