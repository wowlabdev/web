import { intlayerMiddleware } from "next-intlayer/middleware";
import { type NextRequest } from "next/server";

import { updateSession } from "@wowlab/shared/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request, () => intlayerMiddleware(request));
}

export const config = {
  // eslint-disable-next-line unicorn/prefer-string-raw -- Next.js statically analyzes this segment config and cannot evaluate a String.raw tagged template
  matcher: "/((?!api|go|trpc|_next|.*\\..*).*)",
};
