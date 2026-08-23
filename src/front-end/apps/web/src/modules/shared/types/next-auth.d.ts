import type { DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

interface CourseDemyUser {
  id: string;
  email?: string | null;
  username?: string | null;
  role?: string | null;
  avatar_url?: string | null;
}

declare module "next-auth" {
  interface Session {
    user: CourseDemyUser;
    accessToken?: string;
    error?: string;
  }

  interface User extends DefaultUser {
    username?: string;
    role?: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user?: CourseDemyUser;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
