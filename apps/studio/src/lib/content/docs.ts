import { docs as veliteDocs } from "#content";

import { createContentCollection } from "@wowlab/shared/lib/content/collection";
import { routes } from "@wowlab/shared/lib/routing";

export type { Doc } from "#content";

export const docs = createContentCollection(
  veliteDocs,
  "docs",
  routes.dev.docs.index.path,
);
