"use client";

import type { ReactNode } from "react";

import { useEffect } from "react";

import { subscribeToAuthChanges } from "@/lib/query/services";

const AUTH_PATH = "/auth";
const PRIVATE_PATH_PREFIXES = ["/account", "/admin", "/simulate", "/dev/mcp"];

type AuthEventsIslandProps = {
  children: ReactNode;
};

export function AuthEventsIsland({
  children,
}: Readonly<AuthEventsIslandProps>) {
  useEffect(() => {
    return subscribeToAuthChanges((event, session) => {
      const pathName = window.location.pathname;
      const user = session?.user;

      if (!user && isPrivatePath(pathName)) {
        window.location.assign("/");

        return;
      }

      if (event === "SIGNED_OUT") {
        if (isAuthPath(pathName)) {
          return;
        }

        window.location.reload();
      }
    });
  }, []);

  return <>{children}</>;
}

function isAuthPath(pathName: string): boolean {
  return stripLocale(pathName).startsWith(AUTH_PATH);
}

function isPrivatePath(pathName: string): boolean {
  const normalized = stripLocale(pathName);

  return PRIVATE_PATH_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function stripLocale(pathName: string): string {
  return pathName.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
}
