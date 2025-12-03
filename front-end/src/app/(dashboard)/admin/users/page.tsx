"use client";

import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const UserManagerment = () => {
  const { get } = useApi();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const data = await get("/user/all");
    setUsers(data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-5">
        Quản lý người dùng
      </h1>

      {/* Bảng dữ liệu */}
      <div>
        <DataTable
          data={users}
          reload={getUsers} // reload khi thực hiện các thao tác trên bảng
          columns={(reload) => columns(reload)}
        />
      </div>
    </div>
  );
};

export default UserManagerment;
