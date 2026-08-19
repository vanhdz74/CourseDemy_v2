"use client";

import CardDes from "@/modules/course/components/common/card-des";
import { Skeleton } from "@/modules/shared/components/ui/skeleton";
import { api } from "@repo/api";
import { queryKeys } from "@repo/api";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/modules/shared/i18n";

const CourseSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <Skeleton className="aspect-[16/10] w-full rounded-none" />
    <div className="space-y-3 p-4">
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  </div>
);

const TrendingCourses = () => {
  const { t } = useI18n();
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.courses.search({ p: 1 }),
    queryFn: () => api.courses.searchCourses({ p: 1 }),
  });

  const courses = data?.courses.slice(0, 5) ?? [];

  return (
    <section id="trend" className="w-full py-12">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {t("home.trendingTitle")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {t("home.trendingDescription")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <CourseSkeleton key={i} />)
        ) : isError ? (
          <p className="col-span-full rounded-xl border border-red-100 bg-red-50 p-5 text-center text-sm text-red-600">
            {t("home.trendingError")}
          </p>
        ) : courses.length === 0 ? (
          <p className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            {t("home.trendingEmpty")}
          </p>
        ) : (
          courses.map((course) => (
            <CardDes
              key={course.id}
              courseId={course.id}
              img={course.course_img}
              title={course.title}
              description={course.description}
              star={5}
              money={Number(course.price)}
              trending={t("common.students", { count: course.quantity ?? 0 })}
              students={course.quantity}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default TrendingCourses;
