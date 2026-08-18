"use client";

import { useCallback } from "react";
import { useGetAllUsersQuery } from "@/features/users/userApi";
import type { User as BaseUser } from "@/types/userType";

export type User = BaseUser & {
  _id?: string;
  password?: string;
  gender?: string;
  date?: string;
  number?: string;
  fullName?: string;
};

export default function useUsers() {
  const { data: users = [], refetch, isFetching, isLoading, error } = useGetAllUsersQuery();

  const fetchUsers = useCallback(async () => {
    const result = await refetch();
    return result.data ?? [];
  }, [refetch]);

  return {
    users: users as User[],
    fetchUsers,
    isFetching,
    isLoading,
    error,
  };
}
