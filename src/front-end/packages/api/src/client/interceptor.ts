import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { normalizeErrorResponse, normalizeSuccessResponse } from "./error-handler";

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export type ApiClientAuthConfig = {
  getAccessToken?: (forceRefresh?: boolean) => Promise<string | undefined>;
  onUnauthorized?: () => Promise<void> | void;
};

export function attachApiInterceptors(
  client: AxiosInstance,
  authConfig: ApiClientAuthConfig,
) {
  client.interceptors.request.use(
    async (config) => {
      const token = await authConfig.getAccessToken?.();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    normalizeSuccessResponse,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const originalRequest = error.config as RetryRequestConfig | undefined;

      if (status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const token = await authConfig.getAccessToken?.(true);
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          }
        } catch {
          // Fall through to unauthorized handler.
        }

        await authConfig.onUnauthorized?.();
      }

      return normalizeErrorResponse(error);
    },
  );
}
