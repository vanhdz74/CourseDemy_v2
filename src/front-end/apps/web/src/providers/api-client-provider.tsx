"use client";

import { configureApiClient } from "@repo/api";
import { getSession, signOut } from "next-auth/react";
import { useEffect } from "react";

const SESSION_CACHE_MS = 30_000;

let cachedAccessToken: string | undefined;
let cachedAccessTokenExpiresAt = 0;
let pendingAccessToken: Promise<string | undefined> | null = null;

async function getAccessToken(forceRefresh = false) {
  const now = Date.now();

  if (!forceRefresh && cachedAccessToken && cachedAccessTokenExpiresAt > now) {
    return cachedAccessToken;
  }

  if (!forceRefresh && pendingAccessToken) {
    return pendingAccessToken;
  }

  pendingAccessToken = getSession()
    .then((session) => {
      cachedAccessToken = session?.accessToken;
      cachedAccessTokenExpiresAt = Date.now() + SESSION_CACHE_MS;
      return cachedAccessToken;
    })
    .finally(() => {
      pendingAccessToken = null;
    });

  return pendingAccessToken;
}

export function ApiClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    configureApiClient({
      getAccessToken,
      onUnauthorized: () => signOut({ redirect: false }),
    });
  }, []);

  return children;
}
