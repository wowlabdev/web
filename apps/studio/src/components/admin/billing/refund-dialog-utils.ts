export function displayToMinor(value: string): null | string {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return null;
  }

  const [whole, frac = ""] = trimmed.split(".");
  const padded = (frac + "00").slice(0, 2);
  const cleanedWhole = whole!.replace(/^0+(?=\d)/, "");
  const minor = `${cleanedWhole}${padded}`;

  return minor.replace(/^0+(?=\d)/, "") || "0";
}
