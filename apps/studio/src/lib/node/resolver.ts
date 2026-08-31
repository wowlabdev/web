import type { GameDataResolver } from "@wowlab/shared/lib/game-data/game-data-resolver.generated";

import type { ResolverDeps } from "./resolver-types";

import { createDatabaseResolver } from "./resolver-database";
import { createEntityResolver } from "./resolver-entities";

export function createResolver(deps: ResolverDeps): GameDataResolver {
  return {
    ...createDatabaseResolver(deps),
    ...createEntityResolver(deps),
  };
}
