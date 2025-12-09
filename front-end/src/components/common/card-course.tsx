"use client";

import dayjs from "dayjs";
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
import { setCart } from "@/features/cart/cartSlice";
import { number } from "zod";

const CourseCard = ({
  id,
  course_img,
  title,
  description,
  teacher_name,
  completeSpeed,
  star,
  price,
  update_at,
  beginLessonId,
}: Course) => {
  const pathname = usePathname();
  const router = useRouter();
  const { get, post } = useApi();
  const cartItems = useAppSelector((state) => state.cart.items);
  const myItems = useAppSelector((state) => state.my_course.courses);

  const { user } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const [cartCourses, setCartCourses] = useState<number[]>(cartItems);

  const isInCart = cartCourses.includes(id);
  const isInMyCourse = myItems.some((course) => course.id === id);

  const handleGoToCourse = (e: any) => {
    e.stopPropagation(); // Dừng sự kiện nổi lên Card
    dispatch(setCourse({ courseId: id, courseTitle: title }));
    router.push(`/course/${slugify(title)}/${beginLessonId}/edit/0`);
  };

  const handleAddToCart = async (course_id: number, e: any) => {
    e.stopPropagation(); // Dừng sự kiện nổi lên Card

    if (!user?.id) {
      toast.error("Bạn chưa đăng nhập!");
      router.push("/login");
      return;
    }

    try {
      const data = await post(
        `/cart/add?userId=${user.id}&courseId=${course_id}`
      );
      toast.success(data?.message || data || "Đã thêm vào giỏ hàng!");
      setCartCourses((prev) => [...prev, course_id]);

      // Dispatch redux để cập nhật giỏ hàng
      dispatch(setCart([...cartItems, course_id]));
    } catch (err: any) {
      user.role === "STUDENT" &&
        toast.error(
          err?.response?.data?.message || "Khóa học đã có trong giỏ hàng!"
        );
    }
  };

  return (
    <Card
      className="overflow-hidden rounded-xl shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
      onClick={() => {
        dispatch(setCourse({ courseId: id, courseTitle: title }));
        router.push(`/course-detail/${slugify(title)}`);
      }}
    >
      <CardHeader className="px-4">
        <div className="relative h-48">
          <Image
            src={course_img}
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
        <div className="text-sm">Cập nhật mới nhất: {update_at}</div>
      </CardContent>

      <CardFooter className="flex justify-between items-center text-sm">
        {pathname === "/student/my-course" ? (
          <Button className="bg-[var(--buttonAll)]" onClick={handleGoToCourse}>
            Đi đến học
          </Button>
        ) : pathname.includes("teacher") ? (
          <Button className="bg-[var(--buttonAll)]" onClick={handleGoToCourse}>
            Sửa
          </Button>
        ) : (
          <>
            <div className="font-bold">{price?.toLocaleString()} đ</div>

            {user?.role === "STUDENT" ? (
              isInMyCourse ? (
                // --- User đã mua khóa học ---
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/student/my-course`);
                  }}
                >
                  Đi đến khóa học
                </Button>
              ) : isInCart ? (
                // --- Khóa học đang nằm trong giỏ ---
                <Button
                  className="bg-gray-500 hover:bg-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/cart");
                  }}
                >
                  Vào giỏ hàng
                </Button>
              ) : (
                // --- Chưa mua & chưa có trong giỏ ---
                <Button
                  className="bg-[var(--buttonAll)] hover:bg-[#ae6868]"
                  onClick={(e) => handleAddToCart(id, e)}
                >
                  Thêm vào giỏ hàng
                </Button>
              )
            ) : !user?.role ? (
              // --- Chưa đăng nhập ---
              <Button
                className="bg-[var(--buttonAll)]"
                onClick={(e) => handleAddToCart(id, e)}
              >
                Thêm vào giỏ hàng
              </Button>
            ) : null}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
