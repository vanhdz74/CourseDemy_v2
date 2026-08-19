"use client";

import { Course } from "@repo/contracts";
import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@repo/api";
import { queryKeys } from "@repo/api";
import { BookUser, GraduationCap, SearchX, UsersRound } from "lucide-react";

export default function CourseSelectionPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const userId = Number(user?.id);

  const [selectedCourse, setSelectedCourse] = useState<number | "">("");

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: queryKeys.courses.byUser(userId),
    queryFn: () => api.courses.getCoursesByUser(userId),
    enabled: Number.isFinite(userId) && userId > 0,
  });

  const selectedCourseId =
    typeof selectedCourse === "number" ? selectedCourse : 0;

  const { data: students = [], refetch: refetchStudents } = useQuery({
    queryKey: queryKeys.users.byCourse(selectedCourseId),
    queryFn: () => api.users.getUsersByCourse(selectedCourseId),
    enabled: selectedCourseId > 0,
  });

  // Khi chọn khoá → gọi API load sinh viên
  const handleSelectCourse = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const courseId = id ? Number(id) : "";
    setSelectedCourse(courseId);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
              <UsersRound className="h-4 w-4" />
              Student management
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Học viên theo khóa học
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Chọn một khóa học để xem danh sách học viên, tìm kiếm email và
              thêm học viên mới.
            </p>
          </div>

          <div className="w-full lg:w-96">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              Chọn khóa học
            </label>
            <select
              value={selectedCourse}
              onChange={handleSelectCourse}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Chọn khoá học</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {!selectedCourse ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center shadow-sm">
          <BookUser className="h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Chọn khóa học để bắt đầu
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Danh sách học viên sẽ xuất hiện sau khi bạn chọn một khóa học trong
            bộ lọc phía trên.
          </p>
        </div>
      ) : students.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center shadow-sm">
          <SearchX className="h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Chưa có học viên trong khóa học này
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Bạn có thể thêm học viên bằng email sau khi có dữ liệu hoặc chọn
            khóa học khác để kiểm tra.
          </p>
        </div>
      ) : (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Danh sách học viên
              </h2>
              <p className="text-sm text-muted-foreground">
                {students.length} học viên trong khóa học đã chọn.
              </p>
            </div>
          </div>

          <DataTable
            data={students}
            reload={() => refetchStudents()} // reload khi thực hiện các thao tác trên bảng
            columns={(reload) => columns(reload, selectedCourse)}
            courseId={selectedCourse}
          />
        </section>
      )}
    </div>
  );
}
