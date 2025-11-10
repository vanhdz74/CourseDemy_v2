"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { da } from "zod/v4/locales";

const CartItemDisplay = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { get, remove, post } = useApi();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [courseIds, setCourseIds] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  // Lấy giỏ hàng
  const getCoursesInCart = async () => {
    if (!user?.id) return;

    try {
      const data = await get(`/cart/user/${user.id}`);
      const items = Array.isArray(data?.cart_items) ? data.cart_items : [];

      // Gọi API lấy thông tin từng khóa học
      const detailedItems = await Promise.all(
        items.map(async (item: any) => {
          try {
            const course = await get(`/course/${item.course_id}`);

            return {
              ...item,
              title: course.title,
              level: course.level,
              teacher_name: course.teacher_name,
            };
          } catch {
            return { ...item, title: `Khóa học #${item.course_id}` };
          }
        })
      );

      setCartItems(detailedItems);
      setCourseIds(detailedItems.map((i) => i.course_id));

      // Tính tổng
      const totalAmount = detailedItems.reduce(
        (sum: number, item: any) =>
          sum + (item.price || 0) * (item.quantity || 1),
        0
      );
      setTotal(totalAmount);
    } catch (err) {
      toast.error("Lỗi khi lấy giỏ hàng: " + err);
      setCartItems([]);
      setTotal(0);
    }
  };

  // Xoá khóa học khỏi giỏ
  const handleRemove = async (course_id: number) => {
    if (!user?.id) {
      toast.error("Bạn chưa đăng nhập!");
      return;
    }

    try {
      await remove(`/cart/remove?userId=${user.id}&courseId=${course_id}`);
      getCoursesInCart(); // load lại
    } catch (error) {
      toast.error("Xoá thất bại!");
    }
  };

  //
  const handleCreateOrder = async () => {
    const body = {
      user_id: user?.id,
      course_id: courseIds,
      payment_method: "momo",
    };

    try {
      const data = await post("/checkout/cart", body);
      console.log(data);
      router.push("/payment/checkout");
    } catch (err) {
      toast.error("Lỗi: " + err || "Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    getCoursesInCart();
  }, [user?.id]);

  return (
    <div className="flex gap-6 p-4 cursor-pointer">
      {/* Bên trái: danh sách khóa học */}
      <div className="flex-1">
        <h5 className="font-semibold text-lg mb-5 border-b">
          Có {cartItems.length} khóa học trong giỏ hàng
        </h5>

        <div className="space-y-3">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="border p-3 rounded flex justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-[100px] h-[60px] bg-gray-200 rounded"></div>
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

              <div className="flex gap-6">
                <span
                  onClick={() => handleRemove(item.course_id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Xoá
                </span>
                <span className="font-semibold">
                  {item.price?.toLocaleString()} đ
                </span>
              </div>
            </div>
          ))}

          {cartItems.length === 0 && (
            <p className="text-gray-500 italic text-center mt-6">
              Giỏ hàng trống
            </p>
          )}
        </div>
      </div>

      {/* Bên phải: tổng tiền */}
      <div className="min-w-[300px] p-4 h-fit">
        <h2 className="font-semibold text-lg mb-2">Tổng tiền</h2>
        <h1 className="text-2xl font-bold text-red-600 mb-[30px]">
          {total.toLocaleString()} đ
        </h1>

        <Button
          className="w-full h-[50px] cursor-pointer"
          onClick={handleCreateOrder}
        >
          Thanh toán <ArrowRight className="ml-2" />
        </Button>
        <p className="text-sm text-[#3d2626] my-2">
          Bạn sẽ không bị tính phí ngay bây giờ
        </p>
        <hr />
      </div>
    </div>
  );
};

export default CartItemDisplay;
