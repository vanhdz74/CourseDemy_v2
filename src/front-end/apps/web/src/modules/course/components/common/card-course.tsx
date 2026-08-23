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
import { useI18n } from "@/modules/shared/i18n";
import { cn } from "@/modules/shared/lib/utils";
import { formatVND } from "@/modules/shared/utils/formatVND";

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
  const { t } = useI18n();
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
    e.stopPropagation();
    goToStudyCourse();
  };

  const handleEditCourse = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(setCourse({ courseId: id, courseTitle: title }));
    router.push(`/course/${slugify(title)}/${beginLessonId ?? 0}/edit/0`);
  };

  const handleAddToCart = async (
    course_id: number,
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (!user?.id) {
      toast.error(t("courses.loginRequired"));
      router.push("/login");
      return;
    }

    try {
      const data = await addToCart(Number(user.id), course_id);
      toast.success(data?.message || t("courses.addedToCart"));
      setCartCourses((prev) => [...prev, course_id]);

      dispatch(setCart([...cartItems, course_id]));
    } catch (err: unknown) {
      if (user.role === "STUDENT") {
        const apiError = err as ApiError;
        toast.error(
          apiError.response?.data?.message || t("courses.alreadyInCart")
        );
      }
    }
  };

  return (
    <Card
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border-border/80 bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.995]"
      onClick={() => {
        if (pathname === "/student/my-course") {
          goToStudyCourse();
          return;
        }

        dispatch(setCourse({ courseId: id, courseTitle: title }));
        router.push(`/course-detail/${slugify(title)}`);
      }}
    >
      {/* Course Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={course_img}
          alt={title || t("courses.courseImage")}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col gap-3.5 p-4 pb-3">
        <CardTitle className="line-clamp-2 text-base font-bold leading-6 text-foreground transition-colors duration-300 group-hover:text-primary">
          {title}
        </CardTitle>
        
        <CardDescription className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </CardDescription>

        {/* Teacher Info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground/90">
          <UserRound className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="truncate font-semibold">{teacher_name}</span>
        </div>

        {/* Rating and Info */}
        <div className="mt-auto flex items-center justify-between gap-3 text-xs text-muted-foreground">
          {pathname === "/student/my-course" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-bold text-green-600 dark:text-green-400 dark:bg-green-500/5 border border-green-500/20">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              {t("courses.completedPercent", { percent: completeSpeed ?? 0 })}
            </span>
          )}
          
          <div className="ml-auto inline-flex items-center gap-1 font-bold text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{star ?? 5}</span>
          </div>
        </div>

        {/* Updated At */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 border-t border-border/40 pt-2.5">
          <Clock3 className="h-3 w-3" />
          <span>
            {t("courses.updatedAt", {
              date: update_at || t("common.updating"),
            })}
          </span>
        </div>
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="flex items-center justify-between gap-3 border-t border-border/50 p-4 pt-3.5 text-sm bg-muted/10">
        {pathname === "/student/my-course" ? (
          <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-sm" onClick={handleGoToCourse}>
            <BookOpen className="mr-2 h-4 w-4" />
            {t("courses.goToStudy")}
          </Button>
        ) : pathname.includes("teacher") ? (
          <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-sm" onClick={handleEditCourse}>
            {t("courses.edit")}
          </Button>
        ) : (
          <>
            <div className="text-base font-extrabold text-foreground">
              {formatVND(price ?? 0)}
            </div>

            {user?.role === "STUDENT" ? (
              isInMyCourse ? (
                <Button
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/student/my-course`);
                  }}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t("courses.goToCourse")}
                </Button>
              ) : isInCart ? (
                <Button
                  className="rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 text-foreground font-bold px-4 transition-all duration-300 hover:scale-[1.03] active:scale-95 border border-border/80 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/cart");
                  }}
                >
                  {t("courses.goToCart")}
                </Button>
              ) : (
                <Button
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-sm"
                  onClick={(e) => handleAddToCart(id, e)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t("courses.addToCart")}
                </Button>
              )
            ) : !user?.role ? (
              <Button
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-sm"
                onClick={(e) => handleAddToCart(id, e)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t("courses.addToCart")}
              </Button>
            ) : null}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
