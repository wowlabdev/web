export async function decodeSnapshot(bytes: ArrayBuffer): Promise<unknown[]> {
  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  const text = await new Response(stream).text();

  return text
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as unknown);
}

export async function fetchSnapshot(
  snapshotBaseUrl: string,
  table: string,
): Promise<ArrayBuffer> {
  const res = await fetch(`${snapshotBaseUrl}/${table}.ndjson.gz`);

  if (!res.ok) {
    throw new Error(`Snapshot fetch failed for ${table}: ${res.status}`);
  }

  return res.arrayBuffer();
}
