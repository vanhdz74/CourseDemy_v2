"use client";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import { setCheckoutCourses } from "@/features/checkout/checkoutSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Course } from "@/types/courseType";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CHECKOUT_COURSES_STORAGE_KEY = "checkout_courses";
const CHECKOUT_ITEMS_STORAGE_KEY = "checkout_items";

function readStoredCheckoutCourses() {
  try {
    const value = localStorage.getItem(CHECKOUT_COURSES_STORAGE_KEY);
    if (!value) return [];

    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0);
  } catch {
    return [];
  }
}

function readStoredCheckoutItems() {
  try {
    const value = localStorage.getItem(CHECKOUT_ITEMS_STORAGE_KEY);
    if (!value) return [];

    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        const course = item as Partial<Course> & { course_id?: number };
        const id = Number(course.id ?? course.course_id);

        if (!Number.isFinite(id) || !course.title) return null;

        return {
          ...course,
          id,
          price: Number(course.price || 0),
          course_img: course.course_img || course.img || "/logo/favicon.png",
          img: course.img || course.course_img || "/logo/favicon.png",
          description: course.description || "",
          teacher_name: course.teacher_name || "",
          title: course.title,
        } satisfies Course;
      })
      .filter((course): course is Course => course !== null);
  } catch {
    return [];
  }
}

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const reduxCourseIds = useAppSelector((state) => state.checkout.courses);
  const [storedCourseIds] = useState<number[]>(() => readStoredCheckoutCourses());
  const [storedCourseItems] = useState<Course[]>(() => readStoredCheckoutItems());

  const courseIds = useMemo(
    () => (reduxCourseIds.length > 0 ? reduxCourseIds : storedCourseIds),
    [reduxCourseIds, storedCourseIds],
  );

  useEffect(() => {
    if (reduxCourseIds.length === 0 && storedCourseIds.length > 0) {
      dispatch(setCheckoutCourses(storedCourseIds));
    }
  }, [dispatch, reduxCourseIds.length, storedCourseIds]);

  const {
    data: courseItems = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["checkout", "courses", courseIds],
    queryFn: () => Promise.all(courseIds.map((id) => api.courses.getCourseById(id))),
    enabled: courseIds.length > 0 && storedCourseItems.length === 0,
  });

  const checkoutItems = storedCourseItems.length > 0 ? storedCourseItems : courseItems;

  if (courseIds.length === 0) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-xl border border-border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Chưa có khóa học để thanh toán
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vui lòng quay lại giỏ hàng và chọn khóa học cần thanh toán.
        </p>
        <Link
          href="/cart"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Quay lại giỏ hàng
        </Link>
      </div>
    );
  }

  if (isLoading && checkoutItems.length === 0) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Đang tải thông tin thanh toán...
      </div>
    );
  }

  if (isError && checkoutItems.length === 0) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-xl border border-border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Không tải được thông tin thanh toán
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Kiểm tra lại các khóa học trong giỏ hàng rồi thử lại.
        </p>
        <Link
          href="/cart"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Quay lại giỏ hàng
        </Link>
      </div>
    );
  }

  return <CheckoutForm courseItems={checkoutItems} />;
}
