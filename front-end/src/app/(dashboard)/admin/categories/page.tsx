"use client";

import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const UserManagerment = () => {
  const { get } = useApi();
  const [categories, setCategoies] = useState([]);

  const getCategories = async () => {
    const data = await get("/categories");
    console.log(data);
    setCategoies(data);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-5">Quản lý danh mục</h1>

      {/* Bảng dữ liệu */}
      <div>
        <DataTable
          data={categories}
          reload={getCategories} // reload khi thực hiện các thao tác trên bảng
          columns={(reload) => columns(reload)}
        />
      </div>
    </div>
  );
};

export default UserManagerment;
