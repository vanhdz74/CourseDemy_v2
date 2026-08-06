import { axiosClient } from "@repo/api";
import { useCallback } from "react";

export function useApi() {
  const get = useCallback(async <TResponse = unknown>(url: string) => {
    const res = await axiosClient.get<TResponse>(url);
    return res.data;
  }, []);

  const post = useCallback(
    async <TResponse = unknown, TPayload = unknown>(
      url: string,
      data?: TPayload
    ) => {
      const res = await axiosClient.post<TResponse>(url, data);
      return res.data;
    },
    []
  );

  const put = useCallback(
    async <TResponse = unknown, TPayload = unknown>(
      url: string,
      data: TPayload
    ) => {
      const res = await axiosClient.put<TResponse>(url, data);
      return res.data;
    },
    []
  );

  const remove = useCallback(async <TResponse = unknown>(url: string) => {
    const res = await axiosClient.delete<TResponse>(url);
    return res.data;
  }, []);

  return { get, post, put, remove };
}
