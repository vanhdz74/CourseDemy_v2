import axios from "axios";
import { normalizeErrorResponse, normalizeSuccessResponse } from "./error-handler";
import { attachApiInterceptors, type ApiClientAuthConfig } from "./interceptor";

const authConfig: ApiClientAuthConfig = {};

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const publicClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

attachApiInterceptors(axiosClient, authConfig);
publicClient.interceptors.response.use(
  normalizeSuccessResponse,
  async (error) => {
    if (error?.response?.status === 401) {
      await authConfig.onUnauthorized?.();
    }
    return normalizeErrorResponse(error);
  },
);

export function configureApiClient(config: ApiClientAuthConfig) {
  authConfig.getAccessToken = config.getAccessToken;
  authConfig.onUnauthorized = config.onUnauthorized;
}
