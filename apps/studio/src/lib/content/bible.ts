import { bible as veliteBible } from "#content";

import { createContentCollection } from "@wowlab/shared/lib/content/collection";
import { routes } from "@wowlab/shared/lib/routing";

export type { BibleEntry } from "#content";

export const bible = createContentCollection(
  veliteBible,
  "bible",
  routes.dev.bible.index.path,
);
