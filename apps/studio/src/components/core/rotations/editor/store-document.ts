"use client";

import { travel } from "zustand-travel";
import { createStore } from "zustand/vanilla";

import { createEmptyRotation } from "./lib/empty-rotation";
import { EMPTY_METADATA, hydrate } from "./store-helpers";
import { MAX_HISTORY } from "./store-initial";
import {
  dehydrateScript,
  saveActionToList,
  toggleActionAt,
} from "./store-reducers";
import { type DocumentStore, type EditorSeed } from "./store-types";

export type DocumentStoreApi = ReturnType<typeof createDocumentStore>;

export function createDocumentStore(seed: EditorSeed) {
  return createStore<DocumentStore>()(
    travel(
      (set, get, store) => {
        const controls = () => {
          const value = store.getControls!();

          if (!("archive" in value) || !("canArchive" in value)) {
            throw new Error("Rotation history requires manual archiving");
          }

          return value;
        };

        // flush() archives a pending metadata draft as its own history frame so it stays separate from the following script op.
        const flush = () => {
          const c = controls();

          if (c.canArchive()) {
            c.archive();
          }
        };

        return {
          addList: (name) => {
            if (!name || name in get().script.lists) {
              return;
            }

            flush();
            set((s) => {
              s.script.lists[name] = [];
            });
            controls().archive();
          },
          commitMetadata: () => flush(),

          dehydrate: () => dehydrateScript(get().script),
          loadDraftForSpec: (specId) => {
            set((s) => {
              s.metadata.specId = specId;
              s.script = hydrate(createEmptyRotation());
            });
          },
          metadata: seed.metadata,
          rebaseHistory: () => controls().rebase(),
          removeList: (name) => {
            if (!(name in get().script.lists)) {
              return;
            }

            flush();
            set((s) => {
              delete s.script.lists[name];
            });
            controls().archive();
          },
          replaceScript: (rotation) => {
            const incoming = hydrate(rotation);

            flush();
            set((s) => {
              s.script.actions = incoming.actions;
              s.script.lists = incoming.lists;
              s.script.variables = incoming.variables;
              s.script.version = incoming.version;
            });
            controls().archive();
          },
          resetToEmptyDraft: () => {
            set((s) => {
              s.metadata = { ...EMPTY_METADATA, tags: [] };
              s.script = hydrate(createEmptyRotation());
            });
            controls().rebase();
          },

          resetToLoaded: () => controls().reset(),
          saveAction: (listName, action) => {
            flush();
            set((s) => {
              s.script.lists[listName] = saveActionToList(
                s.script.lists[listName] ?? [],
                action,
              );
            });
            controls().archive();
          },
          script: seed.script,

          toggleActionEnabled: (listId, actionIndex) => {
            const lists = get().script.lists;

            if (!Object.hasOwn(lists, listId)) {
              return;
            }

            if (actionIndex < 0 || actionIndex >= lists[listId].length) {
              return;
            }

            flush();
            set((s) => {
              s.script.lists[listId] = toggleActionAt(
                s.script.lists[listId],
                actionIndex,
              );
            });
            controls().archive();
          },
          updateList: (name, actions) => {
            flush();
            set((s) => {
              s.script.lists[name] = actions;
            });
            controls().archive();
          },
          updateMetadataDraft: (patch) => {
            set((s) => {
              Object.assign(s.metadata, patch);
            });
          },
        };
      },
      { autoArchive: false, maxHistory: MAX_HISTORY },
    ),
  );
}
