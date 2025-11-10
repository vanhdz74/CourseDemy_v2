"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Course } from "@/types/courseType";
import Image from "next/image";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCourse } from "@/features/course/courseSlice";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";

const CourseCard = ({
  id,
  img,
  title,
  description,
  teacher_name,
  completeSpeed,
  star,
  price,
  beginLessonId,
}: Course) => {
  const pathname = usePathname();
  const router = useRouter();
  const { get, post } = useApi();

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [cartCourses, setCartCourses] = useState<number[]>([]);

  const isInCart = cartCourses.includes(id);

  const handleGoToCourse = () => {
    dispatch(setCourse({ courseId: id, courseTitle: title }));
    router.push(`/course/${slugify(title)}/${beginLessonId}/edit/0`);
  };

  const handleAddToCart = async (course_id: number) => {
    if (!user?.id) {
      toast.error("Bạn chưa đăng nhập!");
      return;
    }

    try {
      const data = await post(
        `/cart/add?userId=${user.id}&courseId=${course_id}`
      );
      toast.success(data?.message || data || "Đã thêm vào giỏ hàng!");
      setCartCourses((prev) => [...prev, course_id]);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Khóa học đã có trong giỏ hàng!"
      );
    }
  };

  // Lấy course có trong giỏ hàng
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) return;
      try {
        const data = await get(`/cart/user/${user.id}`);
        const items = Array.isArray(data?.cart_items) ? data.cart_items : [];
        setCartCourses(items.map((i: any) => i.course_id));
      } catch (err) {
        console.error("Lỗi lấy giỏ hàng:", err);
      }
    };

    fetchCart();
  }, [user]);

  return (
    <Card className="overflow-hidden rounded-xl shadow-md">
      <CardHeader className="px-4">
        <div className="relative h-48">
          <Image
            src={
              img && (img.startsWith("http") || img.startsWith("/"))
                ? img
                : "/default.jpg"
            }
            alt={title || "Course image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </CardHeader>

      <CardContent className="min-h-[150px]">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-600 line-clamp-2">
          {description}
        </CardDescription>

        <div className="text-sm text-[#e6c1c1]">{teacher_name}</div>

        <div className="flex justify-between items-center text-sm mt-[20px]">
          {pathname === "/student/my-course" && (
            <>{completeSpeed}% hoàn thành</>
          )}
          <div className="text-yellow-500">⭐ {star}</div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center text-sm">
        {pathname === "/student/my-course" ? (
          <Button className="bg-[var(--buttonAll)]" onClick={handleGoToCourse}>
            Đi đến học
          </Button>
        ) : (
          <>
            <div className="font-bold">{price?.toLocaleString()} đ</div>

            {user?.role === "STUDENT" ? (
              isInCart ? (
                <Button
                  className="bg-gray-500 hover:bg-gray-600"
                  onClick={() => router.push("/cart")}
                >
                  Vào giỏ hàng
                </Button>
              ) : (
                <Button
                  className="bg-[var(--buttonAll)] hover:bg-[#ae6868]"
                  onClick={() => handleAddToCart(id)}
                >
                  Thêm vào giỏ hàng
                </Button>
              )
            ) : (
              <Button
                className="bg-[var(--buttonAll)]"
                onClick={handleGoToCourse}
              >
                Sửa
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
