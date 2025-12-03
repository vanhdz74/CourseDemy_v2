"use client";

import CourseCard from "@/components/common/card-course";

import { useApi } from "@/hooks/useApi";
import { useAppSelector } from "@/redux/hooks";
import { Course } from "@/types/courseType";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MyCourse = () => {
  const { get } = useApi();
  const user = useAppSelector((state) => state.auth.user);

  const [courses, setCourses] = useState<Course[]>([]);

  const getCourses = async () => {
    try {
      const data = await get(`/courses/user/${user?.id}`);
      setCourses(data);
    } catch (err: any) {
      toast.error(err);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-[var(--distanceAll)]">Khoá học của tôi</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {courses.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            course_img={item.course_img}
            title={item.title}
            description={item.description}
            price={item.price}
            quantity={item.quantity}
            teacher_name={item.teacher_name}
            beginLessonId={item.id}
          />
        ))}
      </div>
    </div>
  );
};

export default MyCourse;
