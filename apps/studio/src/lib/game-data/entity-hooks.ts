"use client";

import { useSafeState } from "ahooks";
import { useEffect, useMemo } from "react";

import type { QueryListResult, QueryResult } from "@/lib/data/result";

import { useGameData } from "@/components/shared/islands/game-data-island";
import { log } from "@/lib/observability";

import type { GameCollectionDocuments, GameDb } from "./store";

import { storedDocumentToRow } from "./store";
import { useSortedIds } from "./use-sorted-ids";

type DisplayCollection = "items_display" | "spells_display";
type EntityCollection = DisplayCollection | FullCollection;
type EntityRow<Name extends EntityCollection> = Omit<
  GameCollectionDocuments[Name],
  "pk"
>;
type FullCollection = "items_full" | "spells_full";

export function useDisplayRow<Name extends DisplayCollection>(
  collection: Name,
  ensure: (gameDb: GameDb, ids: number[]) => Promise<void>,
  label: string,
  id: number,
): QueryResult<EntityRow<Name>> {
  const ids = useMemo(() => (id > 0 ? [id] : []), [id]);
  const { data, error, isError, isFetching, isLoading } = useDisplayRows(
    collection,
    ensure,
    label,
    ids,
  );

  return {
    data: data?.at(0),
    error,
    isError,
    isFetching,
    isLoading,
    notFound: !isError && data !== undefined && data.length === 0,
  };
}

export function useDisplayRows<Name extends DisplayCollection>(
  collection: Name,
  ensure: (gameDb: GameDb, ids: number[]) => Promise<void>,
  label: string,
  ids: number[],
): QueryListResult<EntityRow<Name>> {
  return useEntities(collection, ensure, label, ids);
}

export function useFullEntities<Name extends FullCollection>(
  collection: Name,
  ensure: (gameDb: GameDb, ids: number[]) => Promise<void>,
  label: string,
  ids: number[],
): QueryListResult<EntityRow<Name>> {
  return useEntities(collection, ensure, label, ids);
}

export function useFullEntity<Name extends FullCollection>(
  collection: Name,
  ensure: (gameDb: GameDb, id: number) => Promise<void>,
  noun: string,
  id: number,
): QueryResult<EntityRow<Name>> {
  const gameData = useGameData();
  const [row, setRow] = useSafeState<EntityRow<Name> | undefined>();
  const [notFound, setNotFound] = useSafeState(false);

  useEffect(() => {
    setRow(undefined);

    setNotFound(false);

    if (!gameData || id <= 0) {
      return;
    }

    let active = true;

    const sub = getCollection(gameData.gameDb, collection)
      .findOne(String(id))
      .$.subscribe((doc) => {
        if (doc) {
          setRow(documentToRow(doc.toMutableJSON()));
        }
      });

    ensure(gameData.gameDb, id).catch((error: unknown) => {
      log.withError(error).error(`${noun} ${id} load failed`);

      if (active) {
        setNotFound(true);
      }
    });

    return () => {
      active = false;
      sub.unsubscribe();
    };
  }, [gameData, id, collection, ensure, noun, setRow, setNotFound]);

  const isLoading = !row && !notFound;

  return {
    data: row,
    error: null,
    isError: false,
    isFetching: isLoading,
    isLoading,
    notFound,
  };
}

function documentsToRows<Name extends EntityCollection>(
  docs: Iterable<{
    toMutableJSON: () => GameCollectionDocuments[Name];
  }>,
): EntityRow<Name>[] {
  return [...docs].map((doc) => documentToRow(doc.toMutableJSON()));
}

function documentToRow<Name extends EntityCollection>(
  value: GameCollectionDocuments[Name],
): EntityRow<Name> {
  return storedDocumentToRow(value, String(value.id));
}

function getCollection<Name extends EntityCollection>(
  gameDb: GameDb,
  name: Name,
) {
  return gameDb.collections[name];
}

function useEntities<Name extends EntityCollection>(
  collection: Name,
  ensure: (gameDb: GameDb, ids: number[]) => Promise<void>,
  label: string,
  ids: number[],
): QueryListResult<EntityRow<Name>> {
  const gameData = useGameData();
  const sorted = useSortedIds(ids);
  const [data, setData] = useSafeState<EntityRow<Name>[] | undefined>();

  useEffect(() => {
    setData(undefined);

    if (!gameData || sorted.length === 0) {
      return;
    }

    let active = true;
    let loaded = false;
    const coll = getCollection(gameData.gameDb, collection);
    const keys = sorted.map(String);

    const sub = coll.findByIds(keys).$.subscribe((found) => {
      if (active && loaded) {
        setData(documentsToRows(found.values()));
      }
    });

    ensure(gameData.gameDb, sorted)
      .catch((error: unknown) => {
        log.withError(error).error(`${label} load failed`);
      })
      .finally(() => {
        if (!active) {
          return;
        }

        loaded = true;

        void coll
          .findByIds(keys)
          .exec()
          .then((found) => {
            if (active) {
              setData(documentsToRows(found.values()));
            }
          });
      });

    return () => {
      active = false;
      sub.unsubscribe();
    };
  }, [gameData, sorted, collection, ensure, label, setData]);

  if (sorted.length === 0) {
    return {
      data: [],
      error: null,
      isError: false,
      isFetching: false,
      isLoading: false,
    };
  }

  const isLoading = data === undefined;

  return {
    data,
    error: null,
    isError: false,
    isFetching: isLoading,
    isLoading,
  };
}
