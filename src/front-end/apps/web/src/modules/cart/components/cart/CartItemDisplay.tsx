"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/modules/shared/store/hooks";
import { setCart } from "@/modules/cart/store/cartSlice";
import { setCheckoutCourses } from "@/modules/payment/store/checkoutSlice"; // slice mới
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/modules/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { DetailedCartItem, getDetailedCart, removeFromCart } from "@repo/api";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@repo/api";

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
    router.push("/checkout");
  };

  const total = cartItems
    .filter((i) => selectedCourses.includes(i.course_id))
    .reduce((sum, i) => sum + Number(i.price || 0), 0);

  return (
    <div className="flex gap-6 p-4">
      <div className="flex-1">
        <h5 className="font-semibold text-lg mb-5 border-b">
          Có {cartItems.length} khóa học trong giỏ hàng
        </h5>
        {isLoading && <p>Đang tải giỏ hàng...</p>}
        {isError && <p className="text-red-500">Không tải được giỏ hàng</p>}
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.course_id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(item.course_id)}
                  onChange={() => handleSelect(item.course_id)}
                />
                <div>
                  <Image
                    src={item.course_img || "/logo/favicon.png"}
                    width={100}
                    height={100}
                    alt={item.title || "Course image"}
                    className="w-25 h-15"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">
                    Bởi {item.teacher_name}
                  </p>
                  <span className="text-xs text-gray-500">
                    Cấp độ: {item.level}
                  </span>
                </div>
              </div>

              <div className="flex gap-6 items-center">
                <span
                  onClick={() => handleRemove(item.course_id)}
                  className="text-sm text-red-500 hover:underline cursor-pointer"
                >
                  Xoá
                </span>
                <span className="font-semibold">
                  {item.price?.toLocaleString()} đ
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-[300px] p-4 h-fit">
        <h2 className="font-semibold text-lg mb-2">Tổng tiền</h2>
        <h1 className="text-2xl font-bold text-red-600 mb-[30px]">
          {total.toLocaleString()} đ
        </h1>
        <Button className="w-full h-[50px]" onClick={goToPayment}>
          Tiến hành thanh toán <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CartItemDisplay;
