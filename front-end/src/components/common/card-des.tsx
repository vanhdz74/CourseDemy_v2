import React, { use } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
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
      className="p-0 border-0 hover:shadow-lg transition cursor-pointer"
    >
      <CardHeader>
        <Image
          src={img}
          alt={title}
          width={100}
          height={100}
          className="w-full h-35 object-cover"
        />
      </CardHeader>

      <CardContent className="space-y-2 p-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>

        <p className="text-sm">{students} học viên</p>

        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="ml-1">{star}</span>
        </div>
        <div>{formatVND(money)}</div>
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
};

export default CardDes;
