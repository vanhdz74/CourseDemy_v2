"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CourseDisplay from "@/components/common/CourseDisplay";
import CourseFilterSheet from "@/components/course/CourseFilterSheet";

const CourseSearchPage = () => {
  const params = useSearchParams();
  const [apiUrl, setApiUrl] = useState(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/search?${params}`
  );

  // Khi người dùng tìm kiếm từ thanh search (thay đổi query), tự động cập nhật API
  useEffect(() => {
    setApiUrl(`${process.env.NEXT_PUBLIC_API_URL}/courses/search?${params}`);
  }, [params]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Các khoá học có từ khoá "{params.get("keyword") || ""}"
        </h1>
        <CourseFilterSheet onFilter={(url) => setApiUrl(url)} />
      </div>

      <CourseDisplay apiUrl={apiUrl} />
    </div>
  );
};

export default CourseSearchPage;
