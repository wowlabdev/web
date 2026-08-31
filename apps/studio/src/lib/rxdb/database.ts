import {
  addRxPlugin,
  type CollectionsOfDatabase,
  createRxDatabase,
  type RxDatabase,
} from "rxdb";
import { RxDBCleanupPlugin } from "rxdb/plugins/cleanup";
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

addRxPlugin(RxDBCleanupPlugin);
addRxPlugin(RxDBLeaderElectionPlugin);

export type RxdbSingleton<C extends CollectionsOfDatabase> = {
  getDb: () => Promise<RxDatabase<C>>;
  purgeDb: () => Promise<void>;
};

export type RxdbSingletonConfig<C extends CollectionsOfDatabase> = {
  addCollections: (db: RxDatabase<C>) => Promise<void>;
  localDocuments?: boolean;
  multiInstance: boolean;
  name: string;
};

export function createRxdbSingleton<C extends CollectionsOfDatabase>(
  config: RxdbSingletonConfig<C>,
): RxdbSingleton<C> {
  let dbPromise: Promise<RxDatabase<C>> | null = null;

  async function create(): Promise<RxDatabase<C>> {
    const db = await createRxDatabase<C>({
      cleanupPolicy: {},
      closeDuplicates: true,
      localDocuments: config.localDocuments ?? false,
      multiInstance: config.multiInstance,
      name: config.name,
      storage: getRxStorageDexie({ chromeTransactionDurability: "relaxed" }),
    });

    await config.addCollections(db);

    return db;
  }

  function getDb(): Promise<RxDatabase<C>> {
    if (typeof indexedDB === "undefined") {
      throw new TypeError(`${config.name} database is client-only`);
    }

    dbPromise ??= create();

    return dbPromise;
  }

  async function purgeDb(): Promise<void> {
    const db = await getDb();

    await db.remove();
    dbPromise = null;
  }

  return { getDb, purgeDb };
}
