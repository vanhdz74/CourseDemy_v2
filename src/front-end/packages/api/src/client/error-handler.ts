import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "@repo/contracts";

type ErrorResponse = AxiosResponse<ApiResponse<null>> & {
  config: InternalAxiosRequestConfig;
};

export function isApiResponse<T = unknown>(payload: unknown): payload is ApiResponse<T> {
  return (
    typeof payload === "object" &&
    payload !== null &&
    ("success" in payload || "status" in payload) &&
    "data" in payload
  );
}

export function unwrapApiResponse<T>(payload: unknown): T {
  if (isApiResponse<T>(payload)) {
    return payload.data as T;
  }

  return payload as T;
}

export function normalizeSuccessResponse(response: AxiosResponse) {
  if (isApiResponse(response.data)) {
    const isOk =
      response.data.success !== false &&
      (response.data.status === undefined || response.data.status < 400);

    if (isOk) {
      response.data =
        response.data.data !== undefined && response.data.data !== null
          ? response.data.data
          : { code: response.data.code, message: response.data.message };
      return response;
    }

    const error = new Error(response.data.message || "Request failed") as AxiosError<ApiResponse<null>>;
    error.response = {
      ...response,
      data: {
        ...response.data,
        data: null,
      },
    } as ErrorResponse;
    return Promise.reject(error);
  }

  return response;
}

export function normalizeErrorResponse(error: AxiosError) {
  const response = error.response;

  if (!response) {
    return Promise.reject(error);
  }

  if (!isApiResponse(response.data)) {
    const message = getLegacyErrorMessage(response.data) || error.message || "Request failed";
    response.data = {
      success: false,
      code: codeFromStatus(response.status),
      message,
      data: null,
      errors: response.data ?? null,
      timestamp: new Date().toISOString(),
    };
  }

  return Promise.reject(error);
}

function getLegacyErrorMessage(payload: unknown) {
  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload === "object" && payload !== null) {
    const record = payload as Record<string, unknown>;
    const message = record.message ?? record.error;
    return typeof message === "string" ? message : undefined;
  }

  return undefined;
}

function codeFromStatus(status?: number) {
  switch (status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    default:
      return status && status >= 500 ? "INTERNAL_SERVER_ERROR" : "ERROR";
  }
}
