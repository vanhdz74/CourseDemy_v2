"use client";

import { ReactNode, useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/modules/shared/store/hooks";
import { slugify } from "@/modules/shared/lib/utils";
import Link from "next/link";
import { Star, ArrowLeft } from "lucide-react";

import ReviewModal from "@/modules/course/components/course/ReviewModal";
import { useApi } from "@/modules/shared/hooks/useApi";

export default function CourseLayout({ children }: { children: ReactNode }) {
  const { courseId, courseTitle } = useAppSelector((state) => state.course);
  const params = useParams<{ course_name?: string }>();
  const [openModal, setOpenModal] = useState(false);

  const { post } = useApi();

  const displayTitle =
    courseTitle ||
    (params?.course_name
      ? decodeURIComponent(params.course_name).replace(/-/g, " ")
      : "Chi tiết khóa học");

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!courseId) return;
    await post(`/review/course/${courseId}`, {
      rating,
      comment,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Trang chủ</span>
          </Link>

          <div className="h-4 w-[1px] bg-border" />

          <Link
            href={`/course/${slugify(displayTitle)}`}
            className="truncate text-sm sm:text-base font-bold text-foreground hover:text-primary transition"
          >
            {displayTitle}
          </Link>
        </div>

        {courseId && (
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-accent/50 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent cursor-pointer transition"
            onClick={() => setOpenModal(true)}
          >
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>Đánh giá khóa học</span>
          </button>
        )}
      </header>

      {openModal && (
        <ReviewModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}

      <div className="flex-1">{children}</div>
    </div>
  );
}

