"use client";

import CheckoutForm from "@/modules/payment/components/checkout/CheckoutForm";
import { setCheckoutCourses } from "@/modules/payment/store/checkoutSlice";
import { useAppDispatch, useAppSelector } from "@/modules/shared/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { api } from "@repo/api";
import { Course } from "@repo/contracts";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/modules/shared/i18n";

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
  const { t } = useI18n();
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
      <div className="mx-auto my-12 max-w-lg rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-foreground">
          {t("checkout.emptyTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("checkout.emptyDescription")}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/cart"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
          >
            {t("checkout.backToCart")}
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground hover:bg-accent transition"
          >
            Khám phá khóa học
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading && checkoutItems.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="h-6 w-48 bg-muted animate-pulse rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="h-24 bg-muted/60 animate-pulse rounded-xl" />
              <div className="h-24 bg-muted/60 animate-pulse rounded-xl" />
              <div className="h-24 bg-muted/60 animate-pulse rounded-xl" />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="h-6 w-40 bg-muted animate-pulse rounded-md" />
            <div className="h-20 bg-muted/60 animate-pulse rounded-xl" />
            <div className="h-20 bg-muted/60 animate-pulse rounded-xl" />
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="h-6 w-32 bg-muted animate-pulse rounded-md" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full bg-muted/60 animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted/60 animate-pulse rounded" />
            </div>
            <div className="h-12 bg-muted animate-pulse rounded-xl mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError && checkoutItems.length === 0) {
    return (
      <div className="mx-auto my-12 max-w-lg rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <h1 className="text-xl font-bold text-destructive">
          {t("checkout.loadErrorTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("checkout.loadErrorDescription")}
        </p>
        <Link
          href="/cart"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
        >
          {t("checkout.backToCart")}
        </Link>
      </div>
    );
  }

  return <CheckoutForm courseItems={checkoutItems} />;
}
