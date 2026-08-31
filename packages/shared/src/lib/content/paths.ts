export const stripNumbers = (path: string) =>
  path
    .split("/")
    .map((s) => s.replace(/^\d+-/, ""))
    .join("/");

export const stripPrefix = (sortKey: string, prefix: string) =>
  sortKey.replace(new RegExp(`^${prefix}/`), "");

export const toSlug = (sortKey: string, prefix: string) =>
  stripNumbers(stripPrefix(sortKey, prefix));
