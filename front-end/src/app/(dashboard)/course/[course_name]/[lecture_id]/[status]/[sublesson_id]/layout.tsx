"use client";

import { ReactNode, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { slugify } from "@/lib/utils";
import Link from "next/link";
import { Star } from "lucide-react";

import ReviewModal from "@/components/course/ReviewModal";
import { useApi } from "@/hooks/useApi";

export default function CourseLayout({ children }: { children: ReactNode }) {
  const { courseId, courseTitle } = useAppSelector((state) => state.course);
  const [openModal, setOpenModal] = useState(false);

  const { post } = useApi();

  const handleSubmitReview = async (rating: number, comment: string) => {
    // Gọi API tạo review
    const data = await post(`/review/course/${courseId}`, {
      rating,
      comment,
    });

    console.log("Đánh giá đã gửi:", rating, comment);
  };

  return (
    <div>
      <div className="flex justify-between items-center h-[var(--navHeight)] bg-black text-[#fff]">
        <div className="flex gap-[20px]">
          <Link href="/home" className="px-[20px] border-r-[1px]">
            LOGO
          </Link>
          <Link href={`/course/${slugify(courseTitle)}`} className="text-xl">
            {courseTitle}
          </Link>
        </div>

        <div
          className="px-10 flex items-center gap-2 cursor-pointer hover:opacity-80"
          onClick={() => setOpenModal(true)}
        >
          <Star className="text-[yellow] w-3" />
          Đánh giá khoá học
        </div>
      </div>

      <ReviewModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmitReview}
      />

      <div>{children}</div>
    </div>
  );
}
