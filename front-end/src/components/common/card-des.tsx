"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Star, UsersRound } from "lucide-react";
import { formatVND } from "@/utils/formatVND";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setCourse } from "@/features/course/courseSlice";
import { slugify } from "@/lib/utils";

interface card {
  img: string;
  courseId: number;
  title: string;
  description: string;
  star: number;
  money: number;
  trending: string;
  students?: number;
}
const CardDes = ({
  courseId,
  img,
  title,
  description,
  star,
  money,
  trending,
  students,
}: card) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <Card
      onClick={() => {
        dispatch(setCourse({ courseId: courseId, courseTitle: title }));
        router.push(`/course-detail/${slugify(title)}`);
      }}
      className="group h-full cursor-pointer overflow-hidden rounded-xl border-slate-200 bg-white p-0 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-purple-200 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <CardContent className="flex min-h-[190px] flex-col gap-3 p-4">
        <CardTitle className="line-clamp-2 text-base font-semibold leading-6 text-slate-950">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm leading-6 text-slate-600">
          {description}
        </CardDescription>

        <div className="mt-auto flex items-center gap-2 text-sm text-slate-500">
          <UsersRound className="h-4 w-4 text-slate-400" />
          <span>{trending || `${students ?? 0} học viên`}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center font-medium text-amber-600">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="ml-1">{star}</span>
          </div>
          <div className="font-bold text-slate-950">{formatVND(money)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardDes;
