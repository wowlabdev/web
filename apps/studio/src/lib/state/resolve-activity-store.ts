import { create } from "zustand";

import type { GameCollectionName } from "@/lib/game-data/store";
import type { ResolveEntity, ResolveEvent } from "@/lib/node/worker-contract";

export type ResolveActivityDetail =
  | { entity: ResolveEntity; id: number; kind: "entity" }
  | { kind: "table"; table: GameCollectionName };

export type ResolveActivityState = {
  active: number;
  detail: ResolveActivityDetail | null;
  fetched: number;
};

type ResolveActivityActions = {
  begin: () => void;
  end: () => void;
  report: (event: ResolveEvent) => void;
};

const IDLE: ResolveActivityState = { active: 0, detail: null, fetched: 0 };

export const useResolveActivityStore = create<
  ResolveActivityActions & ResolveActivityState
>((set) => ({
  ...IDLE,
  begin: () =>
    set((s) =>
      s.active === 0 ? { ...IDLE, active: 1 } : { active: s.active + 1 },
    ),
  end: () => set((s) => (s.active <= 1 ? IDLE : { active: s.active - 1 })),
  report: (event) =>
    set((s) =>
      event.kind === "table"
        ? { detail: { kind: "table", table: event.table } }
        : {
            detail: { entity: event.entity, id: event.id, kind: "entity" },
            fetched: event.source === "supabase" ? s.fetched + 1 : s.fetched,
          },
    ),
}));

export const isResolveBusy = (state: ResolveActivityState): boolean =>
  state.active > 0;

export const beginResolveActivity = (): void =>
  useResolveActivityStore.getState().begin();

export const endResolveActivity = (): void =>
  useResolveActivityStore.getState().end();

export const reportResolveEvent: ResolveActivityActions["report"] = (event) =>
  useResolveActivityStore.getState().report(event);
