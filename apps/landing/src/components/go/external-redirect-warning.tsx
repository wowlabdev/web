import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { ExternalWarning } from "@/components/go/external-warning";
import { isExternalUrl } from "@wowlab/shared/lib/routing";

type ExternalRedirectWarningProps = {
  searchParams: Promise<{ target?: string }>;
};

export async function ExternalRedirectWarning({
  searchParams,
}: Readonly<ExternalRedirectWarningProps>) {
  const { target } = await searchParams;

  if (!target) {
    notFound();
  }

  let url: URL;

  try {
    url = new URL(target);
  } catch {
    notFound();
  }

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const currentOrigin = `${protocol}://${host}`;

  if (!isExternalUrl(url, currentOrigin)) {
    redirect(url.toString());
  }

  return <ExternalWarning targetUrl={url.toString()} targetHost={url.host} />;
}
