"use client";

import { ColumnDef } from "@tanstack/react-table";
import RowActions from "@/modules/admin/components/categories/RowAction";
import { Category } from "@repo/contracts";

export const columns = (reload: () => void): ColumnDef<Category>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Tên danh mục",
  },
  // Phần hành động sẽ có row riêng ở component xử lý
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RowActions category={row.original} reload={reload} />,
  },
];
