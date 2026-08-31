export function hoursFromNowToIso(hours: string): string {
  return new Date(
    Date.now() + Number.parseInt(hours, 10) * 3600 * 1000,
  ).toISOString();
}

export function parseTagsInput(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
