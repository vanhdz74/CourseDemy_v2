"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/modules/shared/store/hooks";
import { setCart } from "@/modules/cart/store/cartSlice";
import { setCheckoutCourses } from "@/modules/payment/store/checkoutSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/modules/shared/components/ui/button";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { DetailedCartItem, getDetailedCart, removeFromCart } from "@repo/api";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@repo/api";
import { cn } from "@/modules/shared/lib/utils";

const EMPTY_CART_ITEMS: DetailedCartItem[] = [];
const CHECKOUT_COURSES_STORAGE_KEY = "checkout_courses";
const CHECKOUT_ITEMS_STORAGE_KEY = "checkout_items";

const CartItemDisplay = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const user = session?.user;
  const userId = Number(user?.id);
  const queryClient = useQueryClient();

  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  const {
    data: cartItems = EMPTY_CART_ITEMS,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.cart.detailed(userId),
    queryFn: () => getDetailedCart(userId),
    enabled: Number.isFinite(userId) && userId > 0,
  });

  useEffect(() => {
    const courseIds = cartItems.map((i) => i.course_id);
    setSelectedCourses(courseIds);
    dispatch(setCart(courseIds));
  }, [cartItems, dispatch]);

  const removeMutation = useMutation({
    mutationFn: (courseId: number) => removeFromCart(userId, courseId),
    onSuccess: (_data, courseId) => {
      queryClient.setQueryData<DetailedCartItem[]>(
        queryKeys.cart.detailed(userId),
        (prev = []) => prev.filter((i) => i.course_id !== courseId)
      );
      dispatch(
        setCart(
          cartItems
            .filter((i) => i.course_id !== courseId)
            .map((i) => i.course_id)
        )
      );
      setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
      toast.success("Xoá thành công");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Lỗi khi xoá";
      toast.error(message);
    },
  });

  const handleRemove = async (course_id: number) => {
    if (!user?.id) return toast.error("Bạn chưa đăng nhập!");
    removeMutation.mutate(course_id);
  };

  const handleSelect = (course_id: number) => {
    setSelectedCourses((prev) =>
      prev.includes(course_id)
        ? prev.filter((id) => id !== course_id)
        : [...prev, course_id]
    );
  };

  const goToPayment = () => {
    if (selectedCourses.length === 0) {
      return toast.error("Vui lòng chọn ít nhất một khóa học");
    }

    dispatch(setCheckoutCourses(selectedCourses));
    const selectedItems = cartItems.filter((item) =>
      selectedCourses.includes(item.course_id)
    );

    localStorage.setItem(
      CHECKOUT_COURSES_STORAGE_KEY,
      JSON.stringify(selectedCourses)
    );
    localStorage.setItem(CHECKOUT_ITEMS_STORAGE_KEY, JSON.stringify(selectedItems));
    router.push("/payment/checkout");
  };

  const total = cartItems
    .filter((i) => selectedCourses.includes(i.course_id))
    .reduce((sum, i) => sum + Number(i.price || 0), 0);

  if (cartItems.length === 0 && !isLoading) {
    return (
      <div className="mx-auto my-12 max-w-lg rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Giỏ hàng của bạn đang trống</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Hãy khám phá các khóa học chất lượng cao để bắt đầu hành trình học tập.
        </p>
        <Button asChild className="mt-6 rounded-xl h-11 px-6 font-semibold">
          <Link href="/">Khám phá khóa học ngay</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start mt-6">
      {/* Left: Cart Items */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-foreground">
              Khóa học trong giỏ hàng
            </span>
            <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-bold">
              {cartItems.length}
            </span>
          </div>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (selectedCourses.length === cartItems.length) {
                  setSelectedCourses([]);
                } else {
                  setSelectedCourses(cartItems.map((i) => i.course_id));
                }
              }}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              {selectedCourses.length === cartItems.length
                ? "Bỏ chọn tất cả"
                : "Chọn tất cả"}
            </button>
          )}
        </div>

        {isLoading && (
          <div className="space-y-3">
            <div className="h-24 bg-muted/60 animate-pulse rounded-2xl" />
            <div className="h-24 bg-muted/60 animate-pulse rounded-2xl" />
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center text-sm text-destructive">
            Không tải được danh sách giỏ hàng. Vui lòng thử lại sau.
          </div>
        )}

        <div className="space-y-3">
          {cartItems.map((item) => {
            const isSelected = selectedCourses.includes(item.course_id);

            return (
              <div
                key={item.course_id}
                className={cn(
                  "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border p-4 bg-card transition-all",
                  isSelected
                    ? "border-primary/40 shadow-xs"
                    : "border-border opacity-70"
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelect(item.course_id)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
                    aria-label={`Chọn khóa học ${item.title}`}
                  />
                  <div className="relative h-18 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    <Image
                      src={item.course_img || "/logo/favicon.png"}
                      fill
                      alt={item.title || "Course image"}
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
                      <span>Bởi {item.teacher_name}</span>
                      {item.level && (
                        <>
                          <span>•</span>
                          <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                            {item.level}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-5 pl-7 sm:pl-0">
                  <span className="text-base font-bold text-foreground">
                    {item.price?.toLocaleString()} đ
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.course_id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition cursor-pointer"
                    aria-label="Xóa khỏi giỏ hàng"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Cart Summary */}
      <div className="lg:col-span-4 sticky top-24">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-foreground pb-3 border-b border-border">
            Tóm tắt đơn hàng
          </h3>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Đã chọn:</span>
              <span className="font-semibold text-foreground">
                {selectedCourses.length} khóa học
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-border/60">
              <span className="font-bold text-base text-foreground">Tổng cộng:</span>
              <span className="text-2xl font-black text-primary tracking-tight">
                {total.toLocaleString()} đ
              </span>
            </div>
          </div>

          <Button
            className="w-full h-12 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
            disabled={selectedCourses.length === 0}
            onClick={goToPayment}
          >
            <span>Tiến hành thanh toán</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-[11px] text-center text-muted-foreground">
            Bảo mật 100% qua cổng thanh toán VNPAY
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItemDisplay;
