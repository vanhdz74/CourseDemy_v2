"use client";

import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAppSelector } from "@/redux/hooks";

const CourseManagerment = () => {
  const { get } = useApi();
  const user = useAppSelector((state) => state.auth.user);
  const [courses, setCourses] = useState([]);

  const getCourses = async () => {
    const data = await get(`/courses/user/${user?.id}`);
    setCourses(data);
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-5">Quản lý khoá học</h1>

      {/* Bảng dữ liệu */}
      <div>
        <DataTable
          data={courses}
          reload={getCourses} // reload khi thực hiện các thao tác trên bảng
          columns={(reload) => columns(reload)}
        />
      </div>
    </div>
  );
};

export default CourseManagerment;
