"use client";

import { useMemo } from "react";
import CourseDisplay from "@/modules/course/components/common/CourseDisplay";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/modules/shared/i18n";

const CourseSearchPage = () => {
  const { t } = useI18n();
  const params = useSearchParams();

  const apiUrl = useMemo(
    () =>
      `${process.env.NEXT_PUBLIC_API_URL}/course/search?${params.toString()}`,
    [params]
  );

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          {t("courses.searchTitle")}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {t("courses.searchDescription", {
            keyword: params.get("keyword") || "",
          })}
        </p>
      </div>

      <CourseDisplay apiUrl={apiUrl} />
    </div>
  );
};

export default CourseSearchPage;
