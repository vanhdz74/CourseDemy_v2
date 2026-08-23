"use client";

import dayjs from "dayjs";

import React, { useEffect, useMemo, useState } from "react";
import CourseCard from "@/modules/course/components/common/card-course";
import PaginationCustom from "@/modules/shared/components/common/Panigation";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { api } from "@repo/api";
import { queryKeys } from "@repo/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AlertCircle, SearchX } from "lucide-react";
import { Skeleton } from "@/modules/shared/components/ui/skeleton";
import { useI18n } from "@/modules/shared/i18n";

interface CourseDisplayProps {
  apiUrl: string;
}

function getSearchParams(apiUrl: string, page: number) {
  const url = new URL(apiUrl, process.env.NEXT_PUBLIC_API_URL);
  url.searchParams.set("p", String(page));
  return Object.fromEntries(url.searchParams.entries());
}

const CourseDisplay: React.FC<CourseDisplayProps> = ({ apiUrl }) => {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = Number(searchParams.get("p")) || 1;
  const filterParams = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("p");
    return params.toString();
  }, [searchParams]);

  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const courseSearchParams = useMemo(
    () => getSearchParams(apiUrl, currentPage),
    [apiUrl, currentPage]
  );

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.courses.search(courseSearchParams),
    queryFn: () => api.courses.searchCourses(courseSearchParams),
    placeholderData: keepPreviousData,
  });

  const courses = data?.courses ?? [];
  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
    setCurrentPage((page) => (page === 1 ? page : 1));
  }, [filterParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("p", currentPage.toString());
    const nextQuery = params.toString();

    if (nextQuery !== searchParams.toString()) {
      router.replace(`?${nextQuery}`, { scroll: false });
    }

    if (Number(searchParams.get("p")) !== currentPage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, router, searchParams]);

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-destructive">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">{t("courses.loadErrorTitle")}</p>
            <p className="mt-1 text-sm text-destructive-foreground/90">
              {error instanceof Error
                ? error.message
                : t("courses.loadErrorDescription")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Loading skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm"
            >
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="space-y-3.5 p-4">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {courses.length > 0 ? (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {courses.map((course) => (
                <CourseCard
                  img=""
                  key={course.id}
                  id={course.id}
                  course_img={course.course_img}
                  title={course.title}
                  description={course.description}
                  teacher_name={course.teacher_name}
                  price={Number(course.price)}
                  update_at={dayjs(String(course.update_at)).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                  beginLessonId={1}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center"
            >
              <SearchX className="h-10 w-10 text-muted-foreground/60" />
              <h2 className="mt-4 text-lg font-bold text-foreground">
                {t("courses.emptyTitle")}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                {t("courses.emptyDescription")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {!isLoading && courses.length > 0 && (
        <PaginationCustom
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            if (page !== currentPage) setCurrentPage(page);
          }}
        />
      )}
    </div>
  );
};

export default CourseDisplay;
