export { intlayerMiddleware as proxy } from "next-intlayer/middleware";

export const config = {
  // eslint-disable-next-line unicorn/prefer-string-raw -- Next.js statically analyzes this segment config and cannot evaluate a String.raw tagged template
  matcher: "/((?!api|go|trpc|_next|.*\\..*).*)",
};
