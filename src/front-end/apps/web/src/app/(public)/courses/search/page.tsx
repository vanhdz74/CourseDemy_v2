"use client";

import { useMemo, useEffect, useState } from "react";
import CourseDisplay from "@/modules/course/components/common/CourseDisplay";
import { useSearchParams, useRouter } from "next/navigation";
import { useI18n } from "@/modules/shared/i18n";
import { Clock, Search } from "lucide-react";

const CourseSearchPage = () => {
  const { t } = useI18n();
  const params = useSearchParams();
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Lấy lịch sử tìm kiếm cục bộ của website
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("coursedemy.search-history") || "[]");
    setSearchHistory(history);
  }, [params]); // Cập nhật lại khi params thay đổi để đồng bộ

  const handleHistoryClick = (term: string) => {
    router.push(`/courses/search?keyword=${term}`);
  };

  const apiUrl = useMemo(
    () =>
      `${process.env.NEXT_PUBLIC_API_URL}/course/search?${params.toString()}`,
    [params]
  );

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          {t("courses.searchTitle")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("courses.searchDescription", {
            keyword: params.get("keyword") || "",
          })}
        </p>

        {/* Danh sách từ khóa tìm kiếm gần đây */}
        {searchHistory.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/40 pt-4">
            <span className="text-xs text-muted-foreground/80 font-bold flex items-center gap-1.5 mr-1">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Từ khóa gần đây:
            </span>
            {searchHistory.map((term) => (
              <button
                key={term}
                onClick={() => handleHistoryClick(term)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border/80 bg-card text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      <CourseDisplay apiUrl={apiUrl} />
    </div>
  );
};

export default CourseSearchPage;
