"use client";

import { ReactNode } from "react";
import { useAppSelector } from "@/redux/hooks";

import { slugify } from "@/lib/utils";
import Link from "next/link";
import { Star } from "lucide-react";

export default function CourseLayout({ children }: { children: ReactNode }) {
  const { courseTitle } = useAppSelector((state) => state.course);

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

        <div className="px-10 flex items-center gap-2">
          <Star className="text-[yellow] w-3" />
          Đánh giá khoá học
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
