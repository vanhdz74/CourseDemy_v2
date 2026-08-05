"use client";

import CardDes from "@/modules/course/components/common/card-des";
import { Skeleton } from "@/modules/shared/components/ui/skeleton";
import { api } from "@repo/api";
import { queryKeys } from "@repo/api";
import { useQuery } from "@tanstack/react-query";

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
  const {
    data: topCourses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.courses.top,
    queryFn: api.courses.getTopCourses,
  });

  return (
    <section id="trend" className="w-full py-12">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Các khoá học đang thịnh hành
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Những khóa học được nhiều học viên quan tâm và đăng ký gần đây.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <CourseSkeleton key={i} />)
        ) : isError ? (
          <p className="col-span-full rounded-xl border border-red-100 bg-red-50 p-5 text-center text-sm text-red-600">
            Có lỗi xảy ra khi tải dữ liệu
          </p>
        ) : topCourses?.length === 0 ? (
          <p className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Chưa có khoá học thịnh hành
          </p>
        ) : (
          topCourses?.map((item) => (
            <CardDes
              key={item.course.id}
              courseId={item.course.id}
              img={item.course.course_img}
              title={item.course.title}
              description={item.course.description}
              star={5}
              money={Number(item.course.price)}
              trending={`${item.students} học viên`}
              students={item.course.quantity}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default TrendingCourses;
