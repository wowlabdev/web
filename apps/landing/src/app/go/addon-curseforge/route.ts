import { connection, NextResponse } from "next/server";

import {
  buildCurseForgeInstallUri,
  fetchLatestRetailFileId,
} from "@/lib/curseforge/client";
import { env } from "@wowlab/shared/lib/env";
import { makeAddonDownloadUrl } from "@wowlab/shared/lib/links";

export async function GET() {
  await connection();

  try {
    const modId = Number(env.CURSEFORGE_MOD_ID);
    const fileId = await fetchLatestRetailFileId(modId);

    return new NextResponse(null, {
      headers: { Location: buildCurseForgeInstallUri(modId, fileId) },
      status: 302,
    });
  } catch {
    return NextResponse.redirect(makeAddonDownloadUrl());
  }
}
