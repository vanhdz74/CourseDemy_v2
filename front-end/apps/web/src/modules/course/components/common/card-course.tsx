"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/modules/shared/components/ui/card";
import { Course } from "@repo/contracts";
import Image from "next/image";
import { Button } from "@/modules/shared/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/modules/shared/store/hooks";
import { setCourse } from "@/modules/course/store/courseSlice";
import { slugify } from "@/modules/shared/lib/utils";
import { toast } from "sonner";
import { useState, type MouseEvent } from "react";
import { setCart } from "@/modules/cart/store/cartSlice";
import { addToCart } from "@repo/api";
import { useSession } from "next-auth/react";
import { BookOpen, CheckCircle2, Clock3, ShoppingCart, Star, UserRound } from "lucide-react";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

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
  const cartItems = useAppSelector((state) => state.cart.items);
  const myItems = useAppSelector((state) => state.my_course.courses);

  const { data: session } = useSession();
  const user = session?.user;

  const dispatch = useAppDispatch();
  const [cartCourses, setCartCourses] = useState<number[]>(cartItems);

  const isInCart = cartCourses.includes(id);
  const isInMyCourse = myItems.some((course) => course.id === id);

  const goToStudyCourse = () => {
    dispatch(setCourse({ courseId: id, courseTitle: title }));
    router.push(`/course/${slugify(title)}/${beginLessonId ?? 0}/view/0`);
  };

  const handleGoToCourse = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Dừng sự kiện nổi lên Card
    goToStudyCourse();
  };

  const handleEditCourse = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Dừng sự kiện nổi lên Card
    dispatch(setCourse({ courseId: id, courseTitle: title }));
    router.push(`/course/${slugify(title)}/${beginLessonId ?? 0}/edit/0`);
  };

  const handleAddToCart = async (
    course_id: number,
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation(); // Dừng sự kiện nổi lên Card

    if (!user?.id) {
      toast.error("Bạn chưa đăng nhập!");
      router.push("/login");
      return;
    }

    try {
      const data = await addToCart(Number(user.id), course_id);
      toast.success(data?.message || "Đã thêm vào giỏ hàng!");
      setCartCourses((prev) => [...prev, course_id]);

      // Dispatch redux để cập nhật giỏ hàng
      dispatch(setCart([...cartItems, course_id]));
    } catch (err: unknown) {
      if (user.role === "STUDENT") {
        const apiError = err as ApiError;
        toast.error(
          apiError.response?.data?.message || "Khóa học đã có trong giỏ hàng!"
        );
      }
    }
  };

  return (
    <Card
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border-slate-200 bg-white p-0 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-purple-200 hover:shadow-md"
      onClick={() => {
        if (pathname === "/student/my-course") {
          goToStudyCourse();
          return;
        }

        dispatch(setCourse({ courseId: id, courseTitle: title }));
        router.push(`/course-detail/${slugify(title)}`);
      }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={course_img}
          alt={title || "Course image"}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <CardTitle className="line-clamp-2 text-base font-semibold leading-6 text-slate-950">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm leading-6 text-slate-600">
          {description}
        </CardDescription>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <UserRound className="h-4 w-4 text-slate-400" />
          <span className="truncate">{teacher_name}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 text-sm text-slate-500">
          {pathname === "/student/my-course" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {completeSpeed ?? 0}% hoàn thành
            </span>
          )}
          <div className="ml-auto inline-flex items-center gap-1 font-medium text-amber-600">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {star ?? 0}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock3 className="h-3.5 w-3.5 text-slate-400" />
          <span>Cập nhật: {update_at || "Đang cập nhật"}</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 border-t border-slate-100 p-4 pt-3 text-sm">
        {pathname === "/student/my-course" ? (
          <Button className="rounded-full bg-[var(--buttonAll)]" onClick={handleGoToCourse}>
            <BookOpen className="mr-2 h-4 w-4" />
            Đi đến học
          </Button>
        ) : pathname.includes("teacher") ? (
          <Button className="rounded-full bg-[var(--buttonAll)]" onClick={handleEditCourse}>
            Sửa
          </Button>
        ) : (
          <>
            <div className="text-base font-bold text-slate-950">
              {price?.toLocaleString()} đ
            </div>

            {user?.role === "STUDENT" ? (
              isInMyCourse ? (
                // --- User đã mua khóa học ---
                <Button
                  className="rounded-full bg-green-600 hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/student/my-course`);
                  }}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Đi đến khóa học
                </Button>
              ) : isInCart ? (
                // --- Khóa học đang nằm trong giỏ ---
                <Button
                  className="rounded-full bg-slate-600 hover:bg-slate-700"
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
                  className="rounded-full bg-[var(--buttonAll)] hover:bg-purple-700"
                  onClick={(e) => handleAddToCart(id, e)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Thêm vào giỏ hàng
                </Button>
              )
            ) : !user?.role ? (
              // --- Chưa đăng nhập ---
              <Button
                className="rounded-full bg-[var(--buttonAll)] hover:bg-purple-700"
                onClick={(e) => handleAddToCart(id, e)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
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
