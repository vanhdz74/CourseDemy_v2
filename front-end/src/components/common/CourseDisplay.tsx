"use client";

import dayjs from "dayjs";

import React, { useEffect, useState } from "react";
import CourseCard from "@/components/common/card-course";
import PaginationCustom from "./Panigation";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Course } from "@/types/courseType";

interface ApiResponse {
  courses: Course[];
  totalPages: number;
  totalElements: number;
}

interface CourseDisplayProps {
  apiUrl: string;
}

const CourseDisplay: React.FC<CourseDisplayProps> = ({ apiUrl }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = Number(searchParams.get("p")) || 1;
  const keywordParams = Number(searchParams.get("keyword"));

  const [courses, setCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //  khi keyword thay đổi thì page = 1, quay lại trang đầu
  useEffect(() => {
    setCurrentPage(1);
  }, [keywordParams]);

  // Lấy danh sách khoá học
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // console.log(`${apiUrl}&p=${currentPage}`);
        const res = await fetch(`${apiUrl}&p=${currentPage}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Lỗi khi tải dữ liệu");

        const data: ApiResponse = await res.json();
        setCourses(data.courses);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    // Cập nhật URL nhưng không reload router
    const params = new URLSearchParams(searchParams.toString());
    params.set("p", currentPage.toString());
    router.replace(`?${params.toString()}`, { scroll: false });

    // Cuộn mượt lên đầu trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, apiUrl]);

  if (error) return <p className="text-red-500">Lỗi: {error}</p>;

  return (
    <div className="flex flex-col gap-6">
      {/* Loading skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 rounded-lg dark:bg-gray-700"
            ></div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3"
          >
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard
                  img=""
                  key={course.id}
                  id={course.id} // phải có id để link tới khoá học
                  course_img={course.course_img}
                  title={course.title}
                  description={course.description}
                  teacher_name={course.teacher_name}
                  price={Number(course.price)}
                  update_at={dayjs(String(course.update_at)).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                  beginLessonId={1} // tìm id đầu tiên xh của khoá học -> là bài đầu tiên
                />
              ))
            ) : (
              <h1>Không tìm thấy khoá học nào liên quan</h1>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <PaginationCustom
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          if (page !== currentPage) setCurrentPage(page);
        }}
      />
    </div>
  );
};

export default CourseDisplay;
