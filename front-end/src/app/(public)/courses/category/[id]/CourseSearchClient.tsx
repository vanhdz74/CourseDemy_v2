"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import CourseDisplay from "@/components/common/CourseDisplay";

const CourseSearchPage = () => {
  const params = useParams();
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    setCategoryName(localStorage.getItem("select") || "");
  }, []);

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Danh mục khóa học
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {categoryName || "Các khóa học trong danh mục đã chọn"}
        </p>
      </div>

      <CourseDisplay
        apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/courses/search?category_id=${params.id}`}
      />
    </div>
  );
};

export default CourseSearchPage;
