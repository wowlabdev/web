"use client";

import { useMemoizedFn, useMount, useSafeState } from "ahooks";
import { createContext, type ReactNode, use } from "react";

import type { UserCollections } from "@/lib/user-data/collections";
import type { UserDb } from "@/lib/user-data/store";

import { createUserCollections } from "@/lib/user-data/collections";
import { getUserDb } from "@/lib/user-data/store";

export type UserDataContextValue = {
  collections: UserCollections;
  userDb: UserDb;
};

const UserDataContext = createContext<UserDataContextValue | null>(null);

type UserDataIslandProps = {
  children: ReactNode;
};

export function UserDataIsland({ children }: Readonly<UserDataIslandProps>) {
  const [value, setValue] = useSafeState<UserDataContextValue | null>(null);

  const init = useMemoizedFn(async () => {
    const db = await getUserDb();

    setValue({ collections: createUserCollections(db), userDb: db });
  });

  useMount(() => {
    void init();
  });

  return <UserDataContext value={value}>{children}</UserDataContext>;
}

export function useUserData(): UserDataContextValue | null {
  return use(UserDataContext);
}
