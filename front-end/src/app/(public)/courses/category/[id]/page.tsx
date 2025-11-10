"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";

import CourseDisplay from "@/components/common/CourseDisplay";

const CourseSearchPage = () => {
  const params = useParams();
  return (
    <div>
      <h1 className="text-2xl mb-[20px]">
        Danh mục
        <p className="text-[red]">{`${localStorage.getItem("category")}`}</p>
      </h1>

      <CourseDisplay
        apiUrl={`${process.env.NEXT_PUBLIC_API_URL}/courses/search?category_id=${params.id}`}
      />
    </div>
  );
};

export default CourseSearchPage;
