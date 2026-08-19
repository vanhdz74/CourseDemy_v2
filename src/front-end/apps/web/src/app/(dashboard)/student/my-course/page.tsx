"use client";

import CourseCard from "@/modules/course/components/common/card-course";
import { Skeleton } from "@/modules/shared/components/ui/skeleton";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@repo/api";
import { queryKeys } from "@repo/api";
import { AlertCircle, BookOpenCheck } from "lucide-react";
import { useI18n } from "@/modules/shared/i18n";

const CourseGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white"
      >
        <Skeleton className="aspect-[16/10] w-full rounded-none" />
        <div className="space-y-3 p-4">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center justify-between pt-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MyCourse = () => {
  const { t } = useI18n();
  const { data: session } = useSession();
  const user = session?.user;
  const userId = Number(user?.id);

  const { data: courses = [], isLoading, isError } = useQuery({
    queryKey: queryKeys.courses.byUser(userId),
    queryFn: () => api.courses.getCoursesByUser(userId),
    enabled: Number.isFinite(userId) && userId > 0,
  });

  return (
    <div className="py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          {t("courses.myCoursesTitle")}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          {t("courses.myCoursesDescription")}
        </p>
      </div>

      {isLoading ? (
        <CourseGridSkeleton />
      ) : isError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-red-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">
                {t("courses.myCoursesLoadErrorTitle")}
              </p>
              <p className="mt-1 text-sm text-red-600">
                {t("courses.myCoursesLoadErrorDescription")}
              </p>
            </div>
          </div>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
          <BookOpenCheck className="h-10 w-10 text-slate-400" />
          <h2 className="mt-4 text-lg font-semibold text-slate-950">
            {t("courses.myCoursesEmptyTitle")}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            {t("courses.myCoursesEmptyDescription")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              img=""
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourse;
