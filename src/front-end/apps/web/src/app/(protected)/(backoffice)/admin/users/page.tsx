"use client";

import { columns } from "@/modules/user/components/users/columns";
import { DataTable } from "@/modules/user/components/users/data-table";
import { useQuery } from "@tanstack/react-query";
import { api } from "@repo/api";
import { queryKeys } from "@repo/api";

const UserManagerment = () => {
  const { data: users = [], refetch } = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: api.users.getAllUsers,
  });

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-5">
        Quản lý người dùng
      </h1>

      {/* Bảng dữ liệu */}
      <div>
        <DataTable
          data={users}
          reload={() => refetch()} // reload khi thực hiện các thao tác trên bảng
          columns={(reload) => columns(reload)}
        />
      </div>
    </div>
  );
};

export default UserManagerment;
