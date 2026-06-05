// "use client";

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import CourseDisplay from "@/components/common/CourseDisplay";
// import CourseFilterSheet from "@/components/course/CourseFilterSheet";

// const CourseSearchPage = () => {
//   const params = useSearchParams();
//   const [apiUrl, setApiUrl] = useState(
//     `${process.env.NEXT_PUBLIC_API_URL}/courses/search?${params}`,
//   );

//   // Khi người dùng tìm kiếm từ thanh search (thay đổi query), tự động cập nhật API
//   useEffect(() => {
//     setApiUrl(`${process.env.NEXT_PUBLIC_API_URL}/courses/search?${params}`);
//   }, [params]);

//   return (
//     <div className="p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-2xl font-semibold">
//           Các khoá học có từ khoá "{params.get("keyword") || ""}"
//         </h1>
//         <CourseFilterSheet onFilter={(url) => setApiUrl(url)} />
//       </div>

//       <CourseDisplay apiUrl={apiUrl} />
//     </div>
//   );
// };

// export default CourseSearchPage;
"use client";

import { useMemo } from "react";
import CourseDisplay from "@/components/common/CourseDisplay";
import { useSearchParams } from "next/navigation";

const CourseSearchPage = () => {
  const params = useSearchParams();

  const apiUrl = useMemo(
    () =>
      `${process.env.NEXT_PUBLIC_API_URL}/courses/search?${params.toString()}`,
    [params]
  );

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Kết quả tìm kiếm
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Các khoá học có từ khoá &quot;{params.get("keyword") || ""}&quot;
        </p>
      </div>

      <CourseDisplay apiUrl={apiUrl} />
    </div>
  );
};

export default CourseSearchPage;
