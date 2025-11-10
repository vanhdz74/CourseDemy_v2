"use client";

import { useParams, useSearchParams } from "next/navigation";
import CourseDisplay from "@/components/common/CourseDisplay";
import { useAppSelector } from "@/redux/hooks";

const TeacherCourseManagement = () => {
  const params = useParams();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <h1 className="text-2xl mb-[20px]">Danh sách</h1>

      <CourseDisplay
        apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/courses/search?teacher_id=${user?.id}`}
      />
    </div>
  );
};

export default TeacherCourseManagement;
