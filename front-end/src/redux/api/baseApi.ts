import { createApi } from "@reduxjs/toolkit/query/react";
import type { AxiosError, AxiosRequestConfig, Method } from "axios";
import axiosClient from "@/api/axiosClient";

type AxiosBaseQueryArgs = {
  url: string;
  method?: Method;
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};

type ApiErrorPayload = {
  status?: number;
  data?: unknown;
  message: string;
};

const axiosBaseQuery =
  () =>
  async ({ url, method = "GET", data, params, headers }: AxiosBaseQueryArgs) => {
    try {
      const result = await axiosClient({
        url,
        method,
        data,
        params,
        headers,
      });

      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const payload: ApiErrorPayload = {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message:
          axiosError.response?.data?.message ||
          axiosError.message ||
          "Request failed",
      };

      return { error: payload };
    }
  };

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Cart",
    "Category",
    "Comment",
    "Course",
    "Lesson",
    "Payment",
    "Review",
    "Revenue",
    "Transaction",
    "User",
  ],
  endpoints: () => ({}),
});

export type ApiMessageResponse = {
  code?: string;
  message?: string;
};
