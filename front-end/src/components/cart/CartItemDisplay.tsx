"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCart } from "@/features/cart/cartSlice";
import { setCheckoutCourses } from "@/features/checkout/checkoutSlice"; // slice mới
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";

const CartItemDisplay = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { get, remove } = useApi();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  const getCoursesInCart = async () => {
    if (!user?.id) return;

    try {
      const data = await get(`/cart/user/${user.id}`);
      const items = Array.isArray(data?.cart_items) ? data.cart_items : [];

      const detailedItems = await Promise.all(
        items.map(async (item: any) => {
          try {
            const course = await get(`/course/${item.course_id}`);
            return { ...item, ...course };
          } catch {
            return { ...item, title: `Khóa học #${item.course_id}` };
          }
        })
      );

      setCartItems(detailedItems);
      // select all by default nếu muốn
      setSelectedCourses(detailedItems.map((i) => i.course_id));
    } catch (err) {
      toast.error("Lỗi khi lấy giỏ hàng: " + err);
      setCartItems([]);
    }
  };

  const handleRemove = async (course_id: number) => {
    if (!user?.id) return toast.error("Bạn chưa đăng nhập!");

    try {
      await remove(`/cart/remove?userId=${user.id}&courseId=${course_id}`);
      setCartItems((prev) => prev.filter((i) => i.course_id !== course_id));
      dispatch(setCart(cartItems.filter((i) => i.course_id !== course_id)));
      setSelectedCourses((prev) => prev.filter((id) => id !== course_id));
      toast.success("Xoá thành công");
    } catch (err: any) {
      toast.error(err?.data?.response?.error || "Lỗi khi xoá");
    }
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

    // dispatch vào checkout slice
    // console.log(selectedCourses);
    dispatch(setCheckoutCourses(selectedCourses));
    router.push("/payment/checkout");
  };

  useEffect(() => {
    getCoursesInCart();
  }, [user?.id]);

  let total = cartItems
    .filter((i) => selectedCourses.includes(i.course_id))
    .reduce((sum, i) => sum + Number(i.price || 0), 0);

  return (
    <div className="flex gap-6 p-4">
      <div className="flex-1">
        <h5 className="font-semibold text-lg mb-5 border-b">
          Có {cartItems.length} khóa học trong giỏ hàng
        </h5>
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
                    src={item.course_img}
                    width={100}
                    height={100}
                    alt={item.course_img}
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
