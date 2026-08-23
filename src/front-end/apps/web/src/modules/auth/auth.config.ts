import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import type { ApiResponse } from "@repo/contracts";

interface BackendTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

interface TokenPayload {
  id: number;
  email: string;
  username: string;
  role: string;
  exp: number;
}

const backendApiUrl =
  process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

async function requestBackendTokens(
  endpoint: "/login" | "/refresh-token",
  body: Record<string, string>,
) {
  if (!backendApiUrl) {
    throw new Error("Thiếu cấu hình URL backend");
  }

  const response = await fetch(
    `${backendApiUrl}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const payload = (await response.json()) as ApiResponse<BackendTokens>;

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Xác thực thất bại");
  }

  return payload.data;
}

function getUserFromAccessToken(accessToken: string) {
  const decoded = jwtDecode<TokenPayload>(accessToken);

  return {
    id: String(decoded.id),
    email: decoded.email,
    username: decoded.username,
    role: decoded.role,
  };
}

function getAccessTokenExpires(accessToken: string) {
  const decoded = jwtDecode<TokenPayload>(accessToken);
  return decoded.exp * 1000;
}

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "");
        const password = String(credentials?.password || "");

        if (!email || !password) {
          return null;
        }

        const tokens = await requestBackendTokens("/login", {
          email,
          password,
        });
        const user = getUserFromAccessToken(tokens.accessToken);

        return {
          id: String(user.id),
          email: user.email,
          name: user.username,
          username: user.username,
          role: user.role,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          accessTokenExpires: getAccessTokenExpires(tokens.accessToken),
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async jwt({ token, user }) {
      if (user) {
        const accessToken = user.accessToken;

        return {
          ...token,
          accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
          user: getUserFromAccessToken(accessToken),
        };
      }

      if (
        typeof token.accessTokenExpires === "number" &&
        Date.now() < token.accessTokenExpires - 30_000
      ) {
        return token;
      }

      try {
        const refreshed = await requestBackendTokens("/refresh-token", {
          refreshToken: String(token.refreshToken || ""),
          refresh_token: String(token.refreshToken || ""),
        });

        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken || token.refreshToken,
          accessTokenExpires: getAccessTokenExpires(refreshed.accessToken),
          user: getUserFromAccessToken(refreshed.accessToken),
          error: undefined,
        };
      } catch (error) {
        console.error(
          "Session refresh failed",
          error instanceof Error ? error.message : "Unknown error"
        );

        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      session.user = (token.user ?? {
        id: "0",
        email: session.user?.email,
        username: session.user?.name,
      }) as typeof session.user;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
