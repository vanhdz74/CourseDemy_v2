"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";

export default function OrderDetailDialog({ order }: any) {
  const t = order.created_at;
  const d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

  const { get } = useApi();

  const [courses, setCourses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  // console.log(order.order_details);

  const fetchCourses = async () => {
    setLoading(true);

    try {
      const result = await Promise.all(
        order.order_details.map((item: any) => get(`/course/${item.course_id}`))
      );
      setCourses(result);
    } catch (e) {
      console.error("Lỗi load course:", e);
    }

    setLoading(false);
  };

  return (
    <Dialog onOpenChange={(open) => open && fetchCourses()}>
      <DialogTrigger className="text-blue-600 hover:underline">
        Xem chi tiết
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng #{order.orderId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-3 text-sm">
          <div>
            <strong>Trạng thái:</strong> {order.status}
          </div>

          <div>
            <strong>Tổng tiền:</strong>{" "}
            {order.total_price.toLocaleString("vi-VN")} đ
          </div>

          <div>
            <strong>Email khách:</strong> {order.email}
          </div>

          <div>
            <strong>Phương thức thanh toán:</strong> {order.payment_method}
          </div>

          <div>
            <strong>Ngày tạo:</strong> {d.toLocaleString("vi-VN")}
          </div>

          <div className="pt-3">
            <strong>Danh sách khoá học:</strong>

            {loading ? (
              <p className="italic text-gray-500 mt-2">Đang tải...</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 mt-3">
                {order.order_details.map((item: any, i: number) => {
                  const course = courses[i];
                  return (
                    <div
                      key={i}
                      className="border rounded-lg p-3 flex gap-3 shadow-sm hover:shadow-md transition"
                    >
                      {/* Ảnh khóa học */}
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                        <Image
                          src={course?.course_img || "/images/no-image.png"}
                          alt={course?.title || "Ảnh khóa học"}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Thông tin khóa học */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-sm">
                            {course?.title ?? "Đang tải..."}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {course?.description}
                          </p>
                        </div>

                        <p className="text-blue-600 font-semibold text-sm">
                          {item?.price?.toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
