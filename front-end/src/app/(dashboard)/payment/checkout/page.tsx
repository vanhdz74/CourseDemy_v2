"use client";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import { useApi } from "@/hooks/useApi";
import { useAppSelector } from "@/redux/hooks";
import { Course } from "@/types/courseType";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { get } = useApi();

  const courseIds = useAppSelector((state) => state.checkout.courses);
  const [courseItems, setCourseItems] = useState<Course[]>([]); // thay vì any[]

  // Lấy danh sách course
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await Promise.all(
          courseIds.map(async (id) => {
            const data = await get(`/course/${id}`);
            return data;
          })
        );
        setCourseItems(courses);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin khóa học:", err);
        setCourseItems([]);
      }
    };

    if (courseIds.length > 0) {
      fetchCourses();
      // console.log(courseItems);
    }
  }, []);

  return <CheckoutForm courseItems={courseItems} />;
}
