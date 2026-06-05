// src/api/axiosClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { normalizeErrorResponse, normalizeSuccessResponse } from "@/api/response";
import { getSession, signOut } from "next-auth/react";

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

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

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Interceptor request
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Nếu body là FormData => để axios tự set multipart/form-data
    if (config.data instanceof FormData) {
      // KHÔNG set Content-Type ở đây,
      // để axios tự thêm boundary phù hợp
    } else {
      // Nếu không phải FormData => gửi JSON
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response
axiosClient.interceptors.response.use(
  normalizeSuccessResponse,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = await getAccessToken(true);
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        }
      } catch {
        // Fall through to sign out below.
      }

      await signOut({ redirect: false });
    }

    return normalizeErrorResponse(error);
  }
);

export default axiosClient;
