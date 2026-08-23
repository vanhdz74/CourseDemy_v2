"use client";

import { configureApiClient } from "@repo/api";
import { getSession, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

const SESSION_CACHE_MS = 30_000;

let cachedAccessToken: string | undefined;
let cachedAccessTokenExpiresAt = 0;
let pendingAccessToken: Promise<string | undefined> | null = null;

async function getAccessToken(forceRefresh = false) {
  const now = Date.now();

  // Trả cache nếu còn hợp lệ và không force refresh
  if (!forceRefresh && cachedAccessToken && cachedAccessTokenExpiresAt > now) {
    return cachedAccessToken;
  }

  // Nếu đang có 1 request lấy token thì chờ nó
  if (pendingAccessToken) {
    return pendingAccessToken;
  }

  // Gọi getSession để lấy token mới (cả khi forceRefresh=false nhưng cache rỗng)
  pendingAccessToken = getSession()
    .then((session) => {
      cachedAccessToken = session?.accessToken;
      cachedAccessTokenExpiresAt = cachedAccessToken
        ? Date.now() + SESSION_CACHE_MS
        : 0;
      return cachedAccessToken;
    })
    .finally(() => {
      pendingAccessToken = null;
    });

  return pendingAccessToken;
}

export function ApiClientProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    cachedAccessToken = session?.accessToken;
    cachedAccessTokenExpiresAt = cachedAccessToken
      ? Date.now() + SESSION_CACHE_MS
      : 0;
  }, [session?.accessToken]);

  useEffect(() => {
    configureApiClient({
      getAccessToken,
      onUnauthorized: async () => {
        await signOut({ redirect: false });
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (!currentPath.startsWith("/login") && !currentPath.startsWith("/register")) {
            const redirectUrl = currentPath === "/" ? "/login" : `/login?callbackUrl=${encodeURIComponent(currentPath + window.location.search)}`;
            window.location.href = redirectUrl;
          }
        }
      },
    });
  }, []);

  return children;
}
