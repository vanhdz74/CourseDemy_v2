"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { queryKeys } from "@/services/queryKeys";

const CourseManagerment = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const userId = Number(user?.id);
  const { data: courses = [], refetch } = useQuery({
    queryKey: queryKeys.courses.byUser(userId),
    queryFn: () => api.courses.getCoursesByUser(userId),
    enabled: Number.isFinite(userId) && userId > 0,
  });

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-5">Quản lý khoá học</h1>

      {/* Bảng dữ liệu */}
      <div>
        <DataTable
          data={courses}
          reload={() => refetch()} // reload khi thực hiện các thao tác trên bảng
          columns={(reload) => columns(reload)}
        />
      </div>
    </div>
  );
};

export default CourseManagerment;
