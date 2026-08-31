import "server-only";

const API_BASE = "https://api.curseforge.com";
const WOW_RETAIL_GAME_VERSION_TYPE_ID = 517;
const REVALIDATE_SECONDS = 1800;

type LatestFilesIndex = {
  fileId: number;
  gameVersionTypeId: number;
  releaseType: number;
};

export function buildCurseForgeInstallUri(
  modId: number,
  fileId: number,
): string {
  return `curseforge://install?addonId=${modId}&fileId=${fileId}`;
}

export async function fetchLatestRetailFileId(modId: number): Promise<number> {
  const apiKey = process.env.CURSEFORGE_API_KEY;

  if (!apiKey) {
    throw new Error("CURSEFORGE_API_KEY is not set");
  }

  const response = await fetch(`${API_BASE}/v1/mods/${modId}`, {
    headers: {
      accept: "application/json",
      "x-api-key": apiKey,
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(
      `CurseForge API ${response.status}: ${await response.text()}`,
    );
  }

  const latestFiles = parseLatestFiles(await response.json());

  const retailFiles = latestFiles
    .filter(
      (entry) => entry.gameVersionTypeId === WOW_RETAIL_GAME_VERSION_TYPE_ID,
    )
    .sort((a, b) => a.releaseType - b.releaseType);

  if (retailFiles.length === 0) {
    throw new Error(`No retail files found for mod ${modId}`);
  }

  return retailFiles[0].fileId;
}

function isLatestFilesIndex(value: unknown): value is LatestFilesIndex {
  return (
    isRecord(value) &&
    typeof value.fileId === "number" &&
    typeof value.gameVersionTypeId === "number" &&
    typeof value.releaseType === "number"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseLatestFiles(value: unknown): LatestFilesIndex[] {
  if (
    !isRecord(value) ||
    !isRecord(value.data) ||
    !Array.isArray(value.data.latestFilesIndexes) ||
    !value.data.latestFilesIndexes.every(isLatestFilesIndex)
  ) {
    throw new Error("CurseForge API returned an invalid mod response");
  }

  return value.data.latestFilesIndexes;
}
