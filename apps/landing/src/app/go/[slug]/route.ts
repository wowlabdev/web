import { connection, NextResponse } from "next/server";

import { apiError, Status } from "@wowlab/shared/lib/api/response";
import { isExternalUrl } from "@wowlab/shared/lib/routing";
import { createClient } from "@wowlab/shared/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await connection();

  const { slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("short_urls")
    .select("target_url")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return apiError(Status.NotFound, "Not found");
  }

  const requestUrl = new URL(request.url);
  const resolvedUrl = new URL(data.target_url, request.url);

  if (isExternalUrl(resolvedUrl, requestUrl.origin)) {
    const warningUrl = new URL("/go/external", request.url);

    warningUrl.searchParams.set("target", resolvedUrl.toString());

    return NextResponse.redirect(warningUrl);
  }

  return NextResponse.redirect(resolvedUrl);
}
