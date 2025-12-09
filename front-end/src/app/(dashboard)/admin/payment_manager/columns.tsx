"use client";

import OrderDetailDialog from "@/components/transaction/OrderDetailDialog";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (reload: () => void): ColumnDef<any>[] => [
  {
    accessorKey: "orderId",
    header: "ID đơn",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
  },
  {
    accessorKey: "total_price",
    header: "Tổng tiền",
    cell: ({ row }) => {
      const value = row.original.total_price;
      return value.toLocaleString("vi-VN") + " đ";
    },
  },
  {
    accessorKey: "payment_method",
    header: "Thanh toán",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "order_details",
    header: "SL Khoá học",
    cell: ({ row }) => row.original.order_details.length,
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const t = row.original.created_at; // [2025,12,2,22,35,16]
      const d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
      return d.toLocaleString("vi-VN");
    },
  },

  // Nếu bạn muốn thêm nút hành động
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <OrderDetailDialog order={row.original} />
      </div>
    ),
  },
];
