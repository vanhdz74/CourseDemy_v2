"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import CourseDisplay from "@/modules/course/components/common/CourseDisplay";
import { useI18n } from "@/modules/shared/i18n";

const CourseSearchPage = () => {
  const { t } = useI18n();
  const params = useParams();
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    setCategoryName(localStorage.getItem("select") || "");
  }, []);

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t("courses.categoryTitle")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {categoryName || t("courses.categoryFallback")}
        </p>
      </div>

      <CourseDisplay
        apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/course/search?category_id=${params.id}`}
      />
    </div>
  );
};

export default CourseSearchPage;
