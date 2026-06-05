import { Course } from "@/types/courseType";
import Image from "next/image";
import ImageUploader from "@/components/common/ImageUploader";
import { MouseEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCart } from "@/features/cart/cartSlice";
import { slugify } from "@/lib/utils";
import { formatVND } from "@/utils/formatVND";
import { setCheckoutCourses } from "@/features/checkout/checkoutSlice"; // slice mới
import { addToCart } from "@/services/cart";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  BookOpenCheck,
  Pencil,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

type CourseDetailForm = {
  content: string;
  request: string;
  description: string;
  course_include: string;
};

type CourseDetailUser = {
  id?: string | number | null;
  role?: string | null;
};

const CHECKOUT_COURSES_STORAGE_KEY = "checkout_courses";
const CHECKOUT_ITEMS_STORAGE_KEY = "checkout_items";

// -------------------- SidebarSection --------------------
export const SidebarSection: React.FC<{
  isEditing: boolean;
  course: Course;
  user?: CourseDetailUser | null;
  editCourse: Course | null;
  setEditCourse: (c: Course | null) => void;
  editDetail: CourseDetailForm;
  setEditDetail: (d: CourseDetailForm) => void;
  editImageFile: File | null;
  handleImageChange: (f: File | null) => void;
  onToggleEdit: () => void;
  onSave: () => Promise<void>;
}> = ({
  isEditing,
  course,
  user,
  editCourse,
  setEditCourse,
  editDetail,
  setEditDetail,
  handleImageChange,
  onToggleEdit,
  onSave,
}) => {
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  const myItems = useAppSelector((state) => state.my_course.courses);

  const dispatch = useAppDispatch();
  const [cartCourses, setCartCourses] = useState<number[]>(cartItems);

  const isInCart = cartCourses.includes(course.id);
  const isInMyCourse = myItems.some(
    (courseItem) => courseItem.id === course.id
  );

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
      const apiError = err as ApiError;
      if (user.role === "STUDENT") {
        toast.error(
          apiError.response?.data?.message || "Khóa học đã có trong giỏ hàng!"
        );
      }
    }
  };

  const handleGoToCourse = () => {
    router.push(`/course/${slugify(course.title)}/${1}/edit/0`);
  };

  const goToPayment = () => {
    const courseIds = [course.id];
    dispatch(setCheckoutCourses(courseIds));
    localStorage.setItem(
      CHECKOUT_COURSES_STORAGE_KEY,
      JSON.stringify(courseIds)
    );
    localStorage.setItem(CHECKOUT_ITEMS_STORAGE_KEY, JSON.stringify([course]));
    router.push("/payment/checkout");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {!isEditing ? (
        <>
          <div className="aspect-video bg-muted">
            {course.course_img ? (
              <Image
                src={course.course_img}
                width={720}
                height={405}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Chưa có ảnh khóa học
              </div>
            )}
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Học phí
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {formatVND(course.price)}
              </p>
            </div>

            {user?.role === "TEACHER" || user?.role === "ADMIN" ? (
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                Bạn đang xem khóa học với quyền quản lý.
              </div>
            ) : (
              <div className="space-y-3">
                {!isInCart ? (
                  <Button
                    onClick={(e) => handleAddToCart(course.id, e)}
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Thêm vào giỏ hàng
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push("/cart")}
                    className="w-full"
                    size="lg"
                    variant="secondary"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    Xem trong giỏ hàng
                  </Button>
                )}

                {!isInMyCourse ? (
                  <Button
                    onClick={goToPayment}
                    className="w-full"
                    size="lg"
                    variant="outline"
                  >
                    Mua ngay
                  </Button>
                ) : (
                  <Button
                    onClick={handleGoToCourse}
                    className="w-full"
                    size="lg"
                    variant="outline"
                  >
                    <BookOpenCheck className="h-4 w-4" />
                    Đi đến khóa học
                  </Button>
                )}

                <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Đảm bảo hoàn tiền trong 30 ngày
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-muted-foreground">Học viên</p>
                <p className="mt-1 font-semibold text-foreground">
                  {course.quantity ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-muted-foreground">Cấp độ</p>
                <p className="mt-1 font-semibold text-foreground">
                  {["Cơ bản", "Trung bình", "Nâng cao"][
                    Number(course.level) - 1
                  ] || "Cơ bản"}
                </p>
              </div>
            </div>

            <section className="border-t border-border pt-4">
              <h2 className="text-base font-semibold text-foreground">
                Khóa học bao gồm
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {editDetail.course_include || "Nội dung đang được cập nhật."}
              </p>
            </section>

            {(user?.role === "TEACHER" || user?.role === "ADMIN") && (
              <Button
                onClick={onToggleEdit}
                className="w-full"
                variant="outline"
              >
                <Pencil className="h-4 w-4" />
                Chỉnh sửa khóa học
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-5 p-5">
          <div className="mb-14">
            <ImageUploader
              value={editCourse?.course_img}
              onChange={handleImageChange}
              label="Upload ảnh khóa học"
              height={200}
              width={300}
            />
          </div>

          <input
            type="number"
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
            value={editCourse?.price}
            onChange={(e) =>
              setEditCourse({ ...editCourse!, price: Number(e.target.value) })
            }
          />

          <select
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
            value={editCourse?.level}
            onChange={(e) =>
              setEditCourse({ ...editCourse!, level: Number(e.target.value) })
            }
          >
            <option value={"1"}>Cơ bản</option>
            <option value={"2"}>Trung bình</option>
            <option value={"3"}>Nâng cao</option>
          </select>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">
              Khóa học bao gồm
            </h2>
            <textarea
              className="min-h-40 w-full rounded-lg border border-input bg-background p-3 text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
              value={editDetail?.course_include}
              onChange={(e) =>
                setEditDetail({
                  ...editDetail!,
                  course_include: e.target.value,
                })
              }
            />
          </section>

          <div className="flex gap-2">
            <Button onClick={onSave} className="flex-1">
              Lưu thay đổi
            </Button>
            <Button onClick={onToggleEdit} variant="outline" className="flex-1">
              Hủy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
