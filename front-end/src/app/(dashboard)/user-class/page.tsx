"use client";

import { useApi } from "@/hooks/useApi";
import { useAppSelector } from "@/redux/hooks";
import { Course } from "@/types/courseType";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function CourseSelectionPage() {
  const { get } = useApi();
  const user = useAppSelector((state) => state.auth.user);

  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();

  // Gọi API lấy danh sách khoá học
  const getCourses = async () => {
    try {
      const data = await get(`/courses/user/${user?.id}`);
      setCourses(data);
    } catch (error: any) {
      toast.error("Lỗi load courses:", error);
    }
  };

  // Gọi API lấy danh sách sinh viên trong khoá học
  const getStudents = async (courseId: number) => {
    try {
      const data = await get(`/users/course/${courseId}`);
      setStudents(data);
    } catch (error: any) {
      toast.error("Lỗi load students:", error);
    }
  };

  // Load danh sách khoá học khi mở trang
  useEffect(() => {
    getCourses();
  }, []);

  // Khi chọn khoá → gọi API load sinh viên
  const handleSelectCourse = (e) => {
    const id = e.target.value;
    setSelectedCourse(id);
    if (id) getStudents(id);
  };

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Chọn khoá học</h1>

      {/* Dropdown chọn khoá */}
      <select
        value={selectedCourse}
        onChange={handleSelectCourse}
        className="border p-2 rounded"
      >
        <option value="">-- Chọn khoá học --</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>

      {/* Danh sách học viên */}
      {selectedCourse && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Danh sách sinh viên:</h2>

          {students.length === 0 ? (
            <p>Chưa có học viên trong khoá học này.</p>
          ) : (
            <div>
              <DataTable
                data={students}
                reload={() => getStudents(selectedCourse)} // reload khi thực hiện các thao tác trên bảng
                columns={(reload) => columns(reload, selectedCourse)}
                courseId={selectedCourse}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
