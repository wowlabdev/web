import { redirect } from "next/navigation";

import { href, routes } from "@wowlab/shared/lib/routing";

export default function AdminRoute() {
  redirect(href(routes.admin.overview));
}
