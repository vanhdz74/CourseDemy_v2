"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/modules/shared/components/ui/card";
import Image from "next/image";
import { Star, UsersRound } from "lucide-react";
import { formatVND } from "@/modules/shared/utils/formatVND";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/modules/shared/store/hooks";
import { setCourse } from "@/modules/course/store/courseSlice";
import { slugify } from "@/modules/shared/lib/utils";

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
      className="group h-full cursor-pointer overflow-hidden rounded-xl border-border/80 bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.99]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition duration-500 group-hover:scale-[1.05]"
        />
      </div>

      <CardContent className="flex min-h-[190px] flex-col gap-3 p-4">
        <CardTitle className="line-clamp-2 text-base font-bold leading-6 text-foreground transition-colors duration-300 group-hover:text-primary">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {description}
        </CardDescription>

        <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground">
          <UsersRound className="h-4 w-4 text-muted-foreground/70" />
          <span>{trending || `${students ?? 0} học viên`}</span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/55 pt-2">
          <div className="flex items-center font-medium text-amber-500">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="ml-1 text-sm font-semibold">{star}</span>
          </div>
          <div className="font-bold text-foreground">{formatVND(money)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardDes;
