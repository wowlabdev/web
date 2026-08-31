import { createCollection } from "@tanstack/react-db";
import { rxdbCollectionOptions } from "@tanstack/rxdb-db-collection";
import { type RxCollection } from "rxdb";

export function createCollectionsRegistry<Db extends object, C>(
  build: (db: Db) => C,
): (db: Db) => C {
  const registry = new WeakMap<Db, C>();

  return (db: Db): C => {
    let collections = registry.get(db);

    if (!collections) {
      collections = build(db);
      registry.set(db, collections);
    }

    return collections;
  };
}

export function mirrorCollection<T extends object>(
  rxCollection: RxCollection<T>,
) {
  return createCollection(
    rxdbCollectionOptions<T>({
      rxCollection,
      startSync: true,
    }),
  );
}
