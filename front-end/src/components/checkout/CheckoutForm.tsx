"use client";
import React, { useState } from "react";
import { Course } from "@/types/courseType";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

interface CheckoutFormProps {
  courseItems: Course[];
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ courseItems }) => {
  const { post } = useApi();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  // Tổng giá trị đơn hàng
  const totalAmount = Array.isArray(courseItems)
    ? courseItems.reduce((sum, item) => sum + Number(item.price), 0)
    : 0;

  const handleSubmit = async () => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    try {
      const body = {
        userId: user?.id, // TODO: Lấy từ Redux hoặc Context
        courseId: courseItems.map((item) => item.id),
        paymentMethod: paymentMethod,
        totalPrice: totalAmount,
      };

      // const data = await post("/checkout", body);

      const payment = await post(
        `/api/payment/create?provider=${paymentMethod}`,
        body
      );
      toast.success("Chuyển hướng đến thanh toán");
      console.log(payment.paymentUrl);
      router.push(payment.paymentUrl);

      // TODO: chuyển hướng đến trang thanh toán nếu cần
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Đã có lỗi xảy ra!";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Thanh toán khóa học</h2>

      <div className="md:flex md:gap-8">
        {/* Left: Payment Options */}
        <div className="md:flex-1 mb-6 md:mb-0">
          <div className="mb-6">
            <h3 className="font-medium mb-2">Phương thức thanh toán</h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:border-blue-500">
                <input
                  type="radio"
                  name="payment"
                  value="vnpay"
                  checked={paymentMethod === "vnpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                VNPay
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:border-blue-500">
                <input
                  type="radio"
                  name="payment"
                  value="momo"
                  checked={paymentMethod === "momo"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                  disabled
                />
                MoMo
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:border-blue-500">
                <input
                  type="radio"
                  name="payment"
                  value="credit-card"
                  checked={paymentMethod === "credit-card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                  disabled
                />
                Credit Card
              </label>
            </div>
          </div>

          {/* Thông tin khóa học */}
          <div className="mt-10">
            <h3>Thông tin thanh toán ({courseItems.length})</h3>
            <hr />
            <div>
              {courseItems.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between mb-5">
                    <div className="flex">
                      <div>
                        <Image
                          src={item.course_img}
                          width={100}
                          height={100}
                          alt={item.title}
                          className="w-25 h-15 mr-5 object-cover"
                        />
                      </div>
                      <div>{item.title}</div>
                    </div>
                    <div>{Number(item.price).toLocaleString()} VNĐ</div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="md:w-76 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-medium mb-4">Tóm tắt đơn hàng</h3>
          <hr />
          <div className="flex justify-between mb-10">
            <span>Giá gốc: </span>
            <span>{totalAmount.toLocaleString()} VNĐ</span>
          </div>

          <div className="text-sm text-[#848383] mx-auto mb-3">
            Bằng việc hoàn tất giao dịch mua, bạn đồng ý với{" "}
            <Link href={"#"} className="text-blue-600">
              Điều khoản dịch vụ
            </Link>
            .
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-sm transition"
          >
            Thanh toán {totalAmount.toLocaleString()} VNĐ
          </Button>

          <div className="text-center mt-10">
            <h3 className="text-md">Đảm bảo hoàn tiền trong 30 ngày</h3>
            <span className="text-sm">
              Bạn không hài lòng? Nhận lại toàn bộ tiền trong vòng 30 ngày. Đơn
              giản và dễ hiểu!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
