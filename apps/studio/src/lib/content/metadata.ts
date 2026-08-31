import "server-only";

export type ContentMetadata =
  (typeof import("#content/content-index.json"))["docs"][number];

export { default as contentIndex } from "#content/content-index.json";
